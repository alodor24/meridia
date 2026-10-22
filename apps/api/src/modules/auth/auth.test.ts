import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { register, registerAndLogin, VALID_PASSWORD } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario y crea sus categorías por defecto', async () => {
    const response = await register(app);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toMatch(/@test\.com$/);
    expect(response.body.data.user.avatar).toBeNull();
    expect(response.body.data.user.avatarPublicId).toBeNull();
    expect(response.body.data.user.password_hash).toBeUndefined();
    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.headers['set-cookie']?.[0]).toContain('meridia_refresh=');

    const agent = request.agent(app);
    const me = await agent
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${response.body.data.accessToken}`);
    expect(me.status).toBe(200);

    const categories = await agent
      .get('/api/categories')
      .set('Authorization', `Bearer ${response.body.data.accessToken}`);
    expect(categories.body.data.items).toHaveLength(12);
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
});

describe('POST /api/auth/login', () => {
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
