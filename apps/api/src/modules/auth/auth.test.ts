import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { register, registerAndLogin, VALID_PASSWORD } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario y crea sus categorías por defecto', async () => {
    const response = await register(app);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toMatch(/@test\.com$/);
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
});
