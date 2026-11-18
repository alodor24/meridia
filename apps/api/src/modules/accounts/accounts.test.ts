import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

describe('GET /api/accounts', () => {
  it('devuelve las cuentas del usuario autenticado', async () => {
    const { agent } = await registerAndLogin(app);

    const created = await agent.post('/api/accounts').send({ name: 'Cuenta 1', type: 'bank', currency: 'ARS' });
    expect(created.status).toBe(201);

    const response = await agent.get('/api/accounts');
    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({ name: 'Cuenta 1', type: 'bank', currency: 'ARS' });
  });

  it('rechaza sin token', async () => {
    const response = await request(app).get('/api/accounts');
    expect(response.status).toBe(401);
  });
});

describe('POST /api/accounts', () => {
  it('rechaza payload inválido', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.post('/api/accounts').send({ name: '', type: 'desconocido' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza moneda con formato inválido', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.post('/api/accounts').send({ name: 'Cuenta', type: 'bank', currency: 'argentinos' });
    expect(response.status).toBe(400);
  });
});

describe('PATCH /api/accounts/:id', () => {
  it('actualiza la cuenta', async () => {
    const { agent } = await registerAndLogin(app);
    const created = await agent.post('/api/accounts').send({ name: 'Original', type: 'cash', currency: 'USD' });
    const id = created.body.data.account.id as string;

    const response = await agent.patch(`/api/accounts/${id}`).send({ name: 'Renombrada' });
    expect(response.status).toBe(200);
    expect(response.body.data.account.name).toBe('Renombrada');
    expect(response.body.data.account.currency).toBe('USD');
  });

  it('actualiza el tipo y la moneda de la cuenta', async () => {
    const { agent } = await registerAndLogin(app);
    const created = await agent.post('/api/accounts').send({ name: 'A', type: 'bank', currency: 'ARS' });
    const id = created.body.data.account.id as string;

    const response = await agent
      .patch(`/api/accounts/${id}`)
      .send({ type: 'savings', currency: 'USD' });
    expect(response.status).toBe(200);
    expect(response.body.data.account.type).toBe('savings');
    expect(response.body.data.account.currency).toBe('USD');
  });

  it('rechaza actualizar una cuenta de otro usuario', async () => {
    const userA = await registerAndLogin(app);
    const created = await userA.agent.post('/api/accounts').send({ name: 'A', type: 'bank', currency: 'ARS' });
    const id = created.body.data.account.id as string;

    const userB = await registerAndLogin(app);
    const response = await userB.agent.patch(`/api/accounts/${id}`).send({ name: 'Robo' });
    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/accounts/:id', () => {
  it('elimina la cuenta', async () => {
    const { agent } = await registerAndLogin(app);
    const created = await agent.post('/api/accounts').send({ name: 'A', type: 'bank', currency: 'ARS' });
    const id = created.body.data.account.id as string;

    const response = await agent.delete(`/api/accounts/${id}`);
    expect(response.status).toBe(204);

    const list = await agent.get('/api/accounts');
    expect(list.body.data.items).toHaveLength(0);
  });

  it('bloquea eliminar una cuenta con movimientos', async () => {
    const { agent } = await registerAndLogin(app);
    const created = await agent.post('/api/accounts').send({ name: 'A', type: 'bank', currency: 'ARS' });
    const id = created.body.data.account.id as string;

    const categories = await agent.get('/api/categories');
    const incomeCategory = categories.body.data.items.find(
      (category: { type: string }) => category.type === 'income',
    );
    await agent.post('/api/transactions').send({
      accountId: id,
      categoryId: incomeCategory.id,
      type: 'income',
      amount: 100,
      date: new Date().toISOString().slice(0, 10),
    });

    const response = await agent.delete(`/api/accounts/${id}`);
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('ACCOUNT_HAS_REFERENCES');
  });
});
