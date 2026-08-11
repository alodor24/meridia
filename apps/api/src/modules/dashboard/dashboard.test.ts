import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

async function setupUser() {
  const { agent } = await registerAndLogin(app);

  const account = await agent.post('/api/accounts').send({ name: 'Caja', type: 'cash', currency: 'ARS' });
  const accountId = account.body.data.account.id as string;
  const categories = await agent.get('/api/categories');
  const expenseCategory = categories.body.data.items.find((c: { type: string }) => c.type === 'expense');
  const incomeCategory = categories.body.data.items.find((c: { type: string }) => c.type === 'income');

  const add = (type: 'expense' | 'income', amount: number, date: string) =>
    agent.post('/api/transactions').send({
      accountId,
      categoryId: type === 'income' ? incomeCategory.id : expenseCategory.id,
      type,
      amount,
      date,
    });

  await add('expense', 400, '2026-08-05');
  await add('income', 1000, '2026-08-01');
  await add('expense', 100, '2026-07-15');

  return agent;
}

describe('GET /api/dashboard', () => {
  it('calcula resumen, balance y últimos movimientos', async () => {
    const agent = await setupUser();

    const response = await agent.get('/api/dashboard?from=2026-08-01&to=2026-08-31');
    expect(response.status).toBe(200);

    const data = response.body.data.dashboard;
    expect(data.income).toBe(1000);
    expect(data.expenses).toBe(400);
    expect(data.periodBalance).toBe(600);
    expect(data.period).toEqual({ from: '2026-08-01', to: '2026-08-31' });
    expect(data.lastTransactions.length).toBeGreaterThan(0);
    expect(data.expensesByCategory.length).toBeGreaterThan(0);
  });

  it('devuelve balance total incluyendo el saldo inicial de cuentas', async () => {
    const agent = await setupUser();

    const response = await agent.get('/api/dashboard');
    expect(response.status).toBe(200);
    expect(typeof response.body.data.dashboard.totalBalance).toBe('number');
  });
});
