import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

describe('GET /api/categories', () => {
  it('devuelve las 12 categorías por defecto del registro', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.get('/api/categories');
    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(12);
  });

  it('filtra por tipo', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.get('/api/categories?type=expense');
    expect(response.status).toBe(200);
    const allExpense = response.body.data.items.every((c: { type: string }) => c.type === 'expense');
    expect(allExpense).toBe(true);
  });
});

describe('POST /api/categories', () => {
  it('crea una categoría', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent
      .post('/api/categories')
      .send({ name: 'Viajes', type: 'expense', color: '#123456' });
    expect(response.status).toBe(201);
    expect(response.body.data.category).toMatchObject({ name: 'Viajes', type: 'expense', color: '#123456' });
  });

  it('rechaza color con formato inválido', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.post('/api/categories').send({ name: 'Viajes', type: 'expense', color: 'rojo' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('DELETE /api/categories/:id', () => {
  it('elimina una categoría', async () => {
    const { agent } = await registerAndLogin(app);
    const created = await agent
      .post('/api/categories')
      .send({ name: 'Temporal', type: 'expense', color: '#000000' });
    const id = created.body.data.category.id as string;

    const response = await agent.delete(`/api/categories/${id}`);
    expect(response.status).toBe(204);
  });

  it('devuelve 404 para una categoría inexistente', async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.delete('/api/categories/00000000-0000-4000-8000-000000000000');
    expect(response.status).toBe(404);
  });
});
