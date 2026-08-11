import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

interface Ctx {
  agent: ReturnType<typeof import('supertest')['agent']>;
  accountId: string;
  expenseCategoryId: string;
  incomeCategoryId: string;
}

async function setupUser(): Promise<Ctx> {
  const { agent } = await registerAndLogin(app);

  const account = await agent.post('/api/accounts').send({ name: 'Caja', type: 'cash', currency: 'ARS' });
  const categories = await agent.get('/api/categories');

  const expenseCategory = categories.body.data.items.find((c: { type: string }) => c.type === 'expense');
  const incomeCategory = categories.body.data.items.find((c: { type: string }) => c.type === 'income');

  return {
    agent,
    accountId: account.body.data.account.id as string,
    expenseCategoryId: expenseCategory.id as string,
    incomeCategoryId: incomeCategory.id as string,
  };
}

function makeTransaction(ctx: Ctx, overrides: Record<string, unknown> = {}) {
  return ctx.agent.post('/api/transactions').send({
    accountId: ctx.accountId,
    categoryId: ctx.expenseCategoryId,
    type: 'expense',
    amount: 1500.5,
    date: '2026-08-10',
    note: 'supermercado',
    ...overrides,
  });
}

describe('POST /api/transactions', () => {
  it('crea un movimiento', async () => {
    const ctx = await setupUser();

    const response = await makeTransaction(ctx);
    expect(response.status).toBe(201);
    expect(response.body.data.transaction).toMatchObject({ amount: 1500.5, type: 'expense', note: 'supermercado' });
    expect(response.body.data.transaction.accountName).toBe('Caja');
  });

  it('rechaza categoría que no coincide con el tipo', async () => {
    const ctx = await setupUser();

    const response = await makeTransaction(ctx, {
      type: 'income',
      categoryId: ctx.expenseCategoryId,
      amount: 100,
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.code).toBe('CATEGORY_TYPE_MISMATCH');
  });

  it('rechaza cuenta de otro usuario', async () => {
    const ctx = await setupUser();
    const other = await setupUser();

    const response = await ctx.agent.post('/api/transactions').send({
      accountId: other.accountId,
      categoryId: ctx.expenseCategoryId,
      type: 'expense',
      amount: 100,
      date: '2026-08-10',
    });
    expect(response.status).toBe(404);
  });

  it('rechaza monto inválido', async () => {
    const ctx = await setupUser();

    const response = await makeTransaction(ctx, { amount: -5 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/transactions', () => {
  it('lista con filtros por fecha y tipo', async () => {
    const ctx = await setupUser();
    await makeTransaction(ctx, { date: '2026-08-10', amount: 100 });
    await makeTransaction(ctx, { date: '2026-07-20', amount: 200, categoryId: ctx.incomeCategoryId, type: 'income' });
    await makeTransaction(ctx, { date: '2026-08-15', amount: 300 });

    const august = await ctx.agent.get('/api/transactions?from=2026-08-01&to=2026-08-31');
    expect(august.status).toBe(200);
    expect(august.body.data.total).toBe(2);

    const expenses = await ctx.agent.get('/api/transactions?type=expense');
    expect(expenses.body.data.total).toBe(2);
    expect(expenses.body.data.items.every((t: { type: string }) => t.type === 'expense')).toBe(true);

    const paginated = await ctx.agent.get('/api/transactions?limit=1&offset=1');
    expect(paginated.body.data.items).toHaveLength(1);
    expect(paginated.body.data.total).toBe(3);
  });
});

describe('PATCH /api/transactions/:id', () => {
  it('actualiza monto y nota', async () => {
    const ctx = await setupUser();
    const created = await makeTransaction(ctx);
    const id = created.body.data.transaction.id as string;

    const response = await ctx.agent.patch(`/api/transactions/${id}`).send({ amount: 999, note: 'actualizado' });
    expect(response.status).toBe(200);
    expect(response.body.data.transaction.amount).toBe(999);
    expect(response.body.data.transaction.note).toBe('actualizado');
  });

  it('devuelve 404 para un movimiento inexistente', async () => {
    const ctx = await setupUser();

    const response = await ctx.agent.patch('/api/transactions/00000000-0000-4000-8000-000000000000').send({ amount: 1 });
    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('elimina un movimiento', async () => {
    const ctx = await setupUser();
    const created = await makeTransaction(ctx);
    const id = created.body.data.transaction.id as string;

    const response = await ctx.agent.delete(`/api/transactions/${id}`);
    expect(response.status).toBe(204);

    const list = await ctx.agent.get('/api/transactions');
    expect(list.body.data.total).toBe(0);
  });
});
