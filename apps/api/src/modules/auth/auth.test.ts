import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../app';
import { env } from '../../config/env';
import { pool } from '../../database/pool';
import {
  getLastPasswordResetEmail,
  getLastVerificationEmail,
} from '../../shared/email/mailer';
import { generateRefreshToken, hashRefreshToken } from '../../shared/utils/tokens';
import { truncateAll } from '../../test/db';
import {
  getPasswordResetToken,
  getVerificationToken,
  register,
  registerAndLogin,
  registerPayload,
  verifyEmail,
  VALID_PASSWORD,
} from '../../test/helpers';

const app = createApp();
const NEW_PASSWORD = 'Meridia2026!Nueva';

const requestPasswordReset = (email: string) =>
  request(app).post('/api/auth/forgot-password').send({ email });

const resetPassword = (token: string, password = NEW_PASSWORD) =>
  request(app).post('/api/auth/reset-password').send({ token, password });

beforeEach(async () => {
  await truncateAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario sin verificar, envía email y no emite tokens', async () => {
    const payload = registerPayload();
    const response = await register(app, payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.user.emailVerified).toBe(false);
    expect(response.body.data.user.avatar).toBeNull();
    expect(response.body.data.user.avatarPublicId).toBeNull();
    expect(response.body.data.user.password_hash).toBeUndefined();
    expect(response.body.data.accessToken).toBeUndefined();
    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.body.data.message).toContain('correo');

    const sent = getLastVerificationEmail(payload.email as string);
    expect(sent).toBeDefined();
    expect(sent?.url).toContain('/verify-email?token=');

    const categories = await pool.query<{ count: number }>(
      `SELECT count(*)::int AS count
       FROM categories c
       JOIN users u ON u.id = c.user_id
       WHERE u.email = $1`,
      [payload.email],
    );
    expect(categories.rows[0]?.count).toBe(0);
  });

  it('verifica el email, crea las categorías por defecto y permite iniciar sesión', async () => {
    const payload = registerPayload();
    await register(app, payload);

    const verification = await verifyEmail(app, payload.email as string);
    expect(verification.status).toBe(200);
    expect(verification.body.data.verified).toBe(true);

    const agent = request.agent(app);
    const login = await agent
      .post('/api/auth/login')
      .send({ email: payload.email, password: payload.password });
    expect(login.status).toBe(200);
    expect(login.body.data.user.emailVerified).toBe(true);

    const categories = await agent
      .get('/api/categories')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`);
    expect(categories.body.data.items).toHaveLength(12);
  });

  it('rechaza un token de verificación inválido', async () => {
    const response = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: 'token-invalido-de-mas-de-veinte-caracteres' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');
  });

  it('rechaza un token de verificación ya usado', async () => {
    const payload = registerPayload();
    await register(app, payload);
    const token = getVerificationToken(payload.email as string);

    const first = await request(app)
      .post('/api/auth/verify-email')
      .send({ token });
    expect(first.status).toBe(200);

    const second = await request(app)
      .post('/api/auth/verify-email')
      .send({ token });
    expect(second.status).toBe(400);
    expect(second.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');
  });

  it('rechaza un token de verificación expirado', async () => {
    const payload = registerPayload();
    await register(app, payload);

    await pool.query(
      `UPDATE email_verification_tokens
       SET expires_at = now() - interval '1 minute'
       WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
      [payload.email],
    );

    const response = await verifyEmail(app, payload.email as string);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');
  });

  it('rechaza email duplicado con EMAIL_TAKEN', async () => {
    const payload = { email: 'dup@test.com', password: VALID_PASSWORD, name: 'Dupe', country: 'AR', currency: 'ARS' };
    await register(app, payload);

    const response = await register(app, payload);
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('rechaza payload inválido (email, contraseña corta, país)', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'no-es-un-email',
      password: '123',
      country: 'XX',
      currency: 'ARS',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toBeDefined();
  });

  it('rechaza una contraseña que no cumple la política', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(registerPayload({ password: 'debil123' }));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/resend-verification', () => {
  it('responde genérico para emails desconocidos', async () => {
    const response = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'no-existe@test.com' });

    expect(response.status).toBe(200);
    expect(response.body.data.message).toContain('Si el email está registrado');
  });

  it('respeta el cooldown y luego invalida el token anterior', async () => {
    const payload = registerPayload();
    await register(app, payload);
    const email = payload.email as string;
    const firstToken = getVerificationToken(email);
    const firstEmail = getLastVerificationEmail(email);

    const immediate = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email });
    expect(immediate.status).toBe(200);
    expect(getLastVerificationEmail(email)).toBe(firstEmail);

    await pool.query(
      `UPDATE email_verification_tokens
       SET created_at = now() - interval '2 minutes'
       WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
      [email],
    );

    const resent = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email });
    expect(resent.status).toBe(200);
    const secondEmail = getLastVerificationEmail(email);
    expect(secondEmail?.url).not.toBe(firstEmail?.url);

    const oldToken = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: firstToken });
    expect(oldToken.status).toBe(400);
    expect(oldToken.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');

    const newToken = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: getVerificationToken(email) });
    expect(newToken.status).toBe(200);
  });

  it('no envía email a usuarios ya verificados', async () => {
    const { email } = await registerAndLogin(app);
    const before = getLastVerificationEmail(email);

    const response = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email });

    expect(response.status).toBe(200);
    expect(getLastVerificationEmail(email)).toBe(before);
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('envía un enlace de restablecimiento a una cuenta verificada', async () => {
    const { email } = await registerAndLogin(app);
    expect(getLastPasswordResetEmail(email)).toBeUndefined();

    const response = await requestPasswordReset(email);

    expect(response.status).toBe(200);
    expect(response.body.data.message).toContain('Si el email está registrado');

    const sent = getLastPasswordResetEmail(email);
    expect(sent).toBeDefined();
    expect(sent?.url).toContain('/reset-password?token=');
  });

  it('responde genérico para emails desconocidos o sin verificar', async () => {
    const payload = registerPayload();
    await register(app, payload);

    const unknown = await requestPasswordReset('no-existe@test.com');
    expect(unknown.status).toBe(200);
    expect(unknown.body.data.message).toContain('Si el email está registrado');
    expect(getLastPasswordResetEmail('no-existe@test.com')).toBeUndefined();

    const unverified = await requestPasswordReset(payload.email as string);
    expect(unverified.status).toBe(200);
    expect(getLastPasswordResetEmail(payload.email as string)).toBeUndefined();
  });

  it('respeta el cooldown e invalida el token anterior', async () => {
    const { email } = await registerAndLogin(app);
    const first = await requestPasswordReset(email);
    expect(first.status).toBe(200);

    const firstEmail = getLastPasswordResetEmail(email);
    const firstToken = getPasswordResetToken(email);

    const immediate = await requestPasswordReset(email);
    expect(immediate.status).toBe(200);
    expect(getLastPasswordResetEmail(email)).toBe(firstEmail);

    await pool.query(
      `UPDATE password_reset_tokens
       SET created_at = now() - interval '2 minutes'
       WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
      [email],
    );

    const resent = await requestPasswordReset(email);
    expect(resent.status).toBe(200);

    const secondEmail = getLastPasswordResetEmail(email);
    expect(secondEmail?.url).not.toBe(firstEmail?.url);

    const oldToken = await resetPassword(firstToken);
    expect(oldToken.status).toBe(400);
    expect(oldToken.body.error.code).toBe('INVALID_PASSWORD_RESET_TOKEN');

    const newToken = await resetPassword(getPasswordResetToken(email));
    expect(newToken.status).toBe(200);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('actualiza la contraseña, revoca sesiones y permite login con la nueva', async () => {
    const { agent, email } = await registerAndLogin(app);

    const refreshed = await agent.post('/api/auth/refresh');
    expect(refreshed.status).toBe(200);

    await requestPasswordReset(email);
    const token = getPasswordResetToken(email);

    const response = await resetPassword(token);
    expect(response.status).toBe(200);
    expect(response.body.data.reset).toBe(true);

    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({ email, password: VALID_PASSWORD });
    expect(oldLogin.status).toBe(401);
    expect(oldLogin.body.error.code).toBe('INVALID_CREDENTIALS');

    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({ email, password: NEW_PASSWORD });
    expect(newLogin.status).toBe(200);

    const reused = await resetPassword(token);
    expect(reused.status).toBe(400);
    expect(reused.body.error.code).toBe('INVALID_PASSWORD_RESET_TOKEN');

    const refreshAfterReset = await agent.post('/api/auth/refresh');
    expect(refreshAfterReset.status).toBe(401);
    expect(refreshAfterReset.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });

  it('rechaza tokens inválidos y expirados', async () => {
    const invalid = await resetPassword(
      'token-invalido-de-mas-de-veinte-caracteres',
    );
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe('INVALID_PASSWORD_RESET_TOKEN');

    const { email } = await registerAndLogin(app);
    await requestPasswordReset(email);
    const token = getPasswordResetToken(email);

    await pool.query(
      `UPDATE password_reset_tokens
       SET expires_at = now() - interval '1 minute'
       WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
      [email],
    );

    const expired = await resetPassword(token);
    expect(expired.status).toBe(400);
    expect(expired.body.error.code).toBe('INVALID_PASSWORD_RESET_TOKEN');
  });

  it('rechaza una contraseña débil sin consumir el token', async () => {
    const { email } = await registerAndLogin(app);
    await requestPasswordReset(email);
    const token = getPasswordResetToken(email);

    const weak = await resetPassword(token, 'debil123');
    expect(weak.status).toBe(400);
    expect(weak.body.error.code).toBe('VALIDATION_ERROR');

    const valid = await resetPassword(token);
    expect(valid.status).toBe(200);
  });
});

describe('POST /api/auth/login', () => {
  it('rechaza login de un usuario sin verificar con EMAIL_NOT_VERIFIED', async () => {
    const payload = registerPayload();
    await register(app, payload);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: payload.email, password: payload.password });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('EMAIL_NOT_VERIFIED');
    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.body.data).toBeUndefined();
  });

  it('inicia sesión con credenciales válidas', async () => {
    const { accessToken } = await registerAndLogin(app);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.user.name).toBe('Test User');
  });

  it('rechaza contraseña incorrecta con INVALID_CREDENTIALS', async () => {
    const { email } = await registerAndLogin(app);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'ContraseñaEquivocada1' });
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('protección de usuarios sin verificar', () => {
  it('rechaza access tokens de usuarios sin verificar', async () => {
    const payload = registerPayload();
    const registered = await register(app, payload);
    const userId = registered.body.data.user.id as string;
    const token = jwt.sign(
      { sub: userId, email: payload.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('EMAIL_NOT_VERIFIED');
  });

  it('rechaza refresh tokens de usuarios sin verificar', async () => {
    const payload = registerPayload();
    const registered = await register(app, payload);
    const userId = registered.body.data.user.id as string;
    const refreshToken = generateRefreshToken();

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + interval '1 day')`,
      [userId, hashRefreshToken(refreshToken)],
    );

    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [`${env.COOKIE_NAME}=${refreshToken}`]);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('EMAIL_NOT_VERIFIED');
  });
});

describe('refresh / logout', () => {
  it('rota el refresh token al refrescar', async () => {
    const { agent } = await registerAndLogin(app);

    const first = await agent.post('/api/auth/refresh');
    expect(first.status).toBe(200);
    expect(first.body.data.accessToken).toBeTruthy();
    const firstCookie = first.headers['set-cookie']?.[0];

    const second = await agent.post('/api/auth/refresh');
    expect(second.status).toBe(200);
    const secondCookie = second.headers['set-cookie']?.[0];
    expect(secondCookie).not.toBe(firstCookie);
  });

  it('logout invalida el refresh token', async () => {
    const { agent } = await registerAndLogin(app);

    const logout = await agent.post('/api/auth/logout');
    expect(logout.status).toBe(204);

    const refresh = await agent.post('/api/auth/refresh');
    expect(refresh.status).toBe(401);
    expect(refresh.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });
});

describe('GET /api/auth/me', () => {
  it('rechaza sin token', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  it('actualiza el nombre con PATCH /me', async () => {
    const { accessToken } = await registerAndLogin(app);

    const response = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Nuevo Nombre' });
    expect(response.status).toBe(200);
    expect(response.body.data.user.name).toBe('Nuevo Nombre');
  });

  it('actualiza solo el avatar y lo persiste', async () => {
    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;
    const publicId = `meridia/avatars/${userId}/avatar-1`;
    const avatar = `https://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`;

    const response = await agent
      .patch('/api/auth/me')
      .send({ avatar, avatarPublicId: publicId });
    expect(response.status).toBe(200);
    expect(response.body.data.user.avatar).toBe(avatar);
    expect(response.body.data.user.avatarPublicId).toBe(publicId);
    expect(response.body.data.user.name).toBe('Test User');

    const me = await agent.get('/api/auth/me');
    expect(me.body.data.user.avatar).toBe(avatar);
    expect(me.body.data.user.avatarPublicId).toBe(publicId);

    const refreshed = await agent.post('/api/auth/refresh');
    expect(refreshed.body.data.user.avatar).toBe(avatar);
    expect(refreshed.body.data.user.avatarPublicId).toBe(publicId);
  });

  it('actualiza nombre y avatar juntos', async () => {
    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;
    const publicId = `meridia/avatars/${userId}/avatar-2`;
    const avatar = `https://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`;

    const response = await agent
      .patch('/api/auth/me')
      .send({ name: 'Nuevo Nombre', avatar, avatarPublicId: publicId });
    expect(response.status).toBe(200);
    expect(response.body.data.user.name).toBe('Nuevo Nombre');
    expect(response.body.data.user.avatar).toBe(avatar);
    expect(response.body.data.user.avatarPublicId).toBe(publicId);
  });

  it('borra el avatar anterior en Cloudinary al actualizarlo', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;
    const firstPublicId = `meridia/avatars/${userId}/avatar-1`;
    const secondPublicId = `meridia/avatars/${userId}/avatar-2`;

    await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/${firstPublicId}.webp`,
      avatarPublicId: firstPublicId,
    });

    const response = await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/${secondPublicId}.webp`,
      avatarPublicId: secondPublicId,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.avatarPublicId).toBe(secondPublicId);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/image/destroy');
    expect(options.method).toBe('POST');

    const body = options.body as URLSearchParams;
    expect(body.get('public_id')).toBe(firstPublicId);
    expect(body.get('api_key')).toBe('test-key');
    expect(body.get('signature')).toHaveLength(40);
  });

  it('mantiene el avatar nuevo si el borrado en Cloudinary falla', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
    vi.stubGlobal('fetch', fetchMock);

    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;
    const firstPublicId = `meridia/avatars/${userId}/avatar-1`;
    const secondPublicId = `meridia/avatars/${userId}/avatar-2`;

    await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/${firstPublicId}.webp`,
      avatarPublicId: firstPublicId,
    });

    const response = await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/${secondPublicId}.webp`,
      avatarPublicId: secondPublicId,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.avatarPublicId).toBe(secondPublicId);
  });

  it('rechaza un avatar que no sea de Cloudinary', async () => {
    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;
    const publicId = `meridia/avatars/${userId}/avatar-1`;

    const response = await agent
      .patch('/api/auth/me')
      .send({
        avatar: 'https://example.com/avatar.webp',
        avatarPublicId: publicId,
      });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza un avatar sin public_id', async () => {
    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;

    const response = await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/meridia/avatars/${userId}/avatar-1.webp`,
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza un public_id que no coincide con la URL', async () => {
    const { agent } = await registerAndLogin(app);
    const userId = (await agent.get('/api/auth/me')).body.data.user.id as string;

    const response = await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/meridia/avatars/${userId}/avatar-1.webp`,
      avatarPublicId: `meridia/avatars/${userId}/avatar-2`,
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza un public_id fuera de la carpeta del usuario', async () => {
    const { agent } = await registerAndLogin(app);
    const publicId = 'meridia/avatars/otro-usuario/avatar-1';

    const response = await agent.patch('/api/auth/me').send({
      avatar: `https://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`,
      avatarPublicId: publicId,
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza un PATCH sin campos', async () => {
    const { accessToken } = await registerAndLogin(app);

    const response = await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
