import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();
const today = new Date().toISOString().slice(0, 10);

type Agent = ReturnType<typeof request.agent>;

beforeEach(async () => {
  await truncateAll();
});

const createAccount = async (
  agent: Agent,
  name: string,
  type = 'bank',
  currency = 'ARS',
): Promise<string> => {
  const response = await agent
    .post('/api/accounts')
    .send({ name, type, currency });
  expect(response.status).toBe(201);
  return response.body.data.account.id as string;
};

const addIncome = async (
  agent: Agent,
  accountId: string,
  amount: number,
): Promise<void> => {
  const categories = await agent.get('/api/categories');
  const incomeCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === 'income',
  );
  const response = await agent.post('/api/transactions').send({
    accountId,
    categoryId: incomeCategory.id,
    type: 'income',
    amount,
    date: today,
  });
  expect(response.status).toBe(201);
};

const setupAccounts = async (
  app: Express,
  destination: { type?: string; currency?: string } = {},
) => {
  const { agent } = await registerAndLogin(app);
  const sourceId = await createAccount(agent, 'Banco');
  const destinationId = await createAccount(
    agent,
    'Billetera',
    destination.type ?? 'wallet',
    destination.currency ?? 'ARS',
  );
  await addIncome(agent, sourceId, 1000);

  return { agent, sourceId, destinationId };
};

const createTransfer = (
  agent: Agent,
  fromAccountId: string,
  toAccountId: string,
  amount = 250,
  note = 'Ahorro',
) =>
  agent.post('/api/transfers').send({
    fromAccountId,
    toAccountId,
    amount,
    note,
  });

describe('POST /api/transfers', () => {
  it('mueve saldo sin afectar el total, los movimientos ni el dashboard', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);

    const response = await createTransfer(agent, sourceId, destinationId);

    expect(response.status).toBe(201);
    expect(response.body.data.transfer).toMatchObject({
      fromAccountId: sourceId,
      toAccountId: destinationId,
      fromAccountName: 'Banco',
      toAccountName: 'Billetera',
      currency: 'ARS',
      amount: 250,
      note: 'Ahorro',
    });

    const accounts = await agent.get('/api/accounts');
    const source = accounts.body.data.items.find(
      (account: { id: string }) => account.id === sourceId,
    );
    const destination = accounts.body.data.items.find(
      (account: { id: string }) => account.id === destinationId,
    );

    expect(source.balance).toBe(750);
    expect(destination.balance).toBe(250);

    const dashboard = await agent.get('/api/dashboard');
    expect(dashboard.body.data.dashboard.totalBalance).toBe(1000);
    expect(dashboard.body.data.dashboard.income).toBe(1000);
    expect(dashboard.body.data.dashboard.expenses).toBe(0);
    expect(dashboard.body.data.dashboard.lastTransactions).toHaveLength(1);

    const transactions = await agent.get('/api/transactions');
    expect(transactions.body.data.total).toBe(1);

    const transfers = await agent.get('/api/transfers');
    expect(transfers.body.data.items).toHaveLength(1);
    expect(transfers.body.data.total).toBe(1);
    expect(transfers.body.data.items[0].id).toBe(
      response.body.data.transfer.id,
    );
  });

  it('rechaza transferir a la misma cuenta', async () => {
    const { agent, sourceId } = await setupAccounts(app);

    const response = await createTransfer(agent, sourceId, sourceId);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza cuentas de distinta moneda', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app, {
      currency: 'USD',
    });

    const response = await createTransfer(agent, sourceId, destinationId);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('misma moneda');
  });

  it('permite transferir a una cuenta de ahorro', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app, {
      type: 'savings',
    });

    const response = await createTransfer(agent, sourceId, destinationId);

    expect(response.status).toBe(201);

    const accounts = await agent.get('/api/accounts');
    const destination = accounts.body.data.items.find(
      (account: { id: string }) => account.id === destinationId,
    );
    expect(destination.balance).toBe(250);
  });

  it('rechaza cuentas que no son efectivo, banco, billetera o ahorro', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app, {
      type: 'credit_card',
    });

    const response = await createTransfer(agent, sourceId, destinationId);

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('ahorro');
  });

  it('rechaza saldo insuficiente', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);

    const response = await createTransfer(agent, sourceId, destinationId, 1500);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('INSUFFICIENT_FUNDS');
  });

  it('rechaza montos que redondean a cero centavos', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);

    const response = await createTransfer(
      agent,
      sourceId,
      destinationId,
      0.001,
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rechaza cuentas de otro usuario', async () => {
    const { sourceId } = await setupAccounts(app);
    const otherUser = await registerAndLogin(app);
    const otherAccountId = await createAccount(otherUser.agent, 'Otra');

    const response = await createTransfer(
      otherUser.agent,
      sourceId,
      otherAccountId,
    );

    expect(response.status).toBe(404);
  });

  it('rechaza sin autenticación', async () => {
    const response = await request(app).post('/api/transfers').send({
      fromAccountId: crypto.randomUUID(),
      toAccountId: crypto.randomUUID(),
      amount: 100,
    });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/transfers', () => {
  it('lista las transferencias del usuario con paginación', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);
    await createTransfer(agent, sourceId, destinationId, 100, 'Primera');
    await createTransfer(agent, sourceId, destinationId, 50, 'Segunda');

    const response = await agent.get('/api/transfers?limit=1&offset=0');

    expect(response.status).toBe(200);
    expect(response.body.data.total).toBe(2);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].note).toBe('Segunda');
  });
});

describe('DELETE /api/transfers/:id', () => {
  it('elimina la transferencia y restaura los saldos', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);
    const created = await createTransfer(agent, sourceId, destinationId);
    const transferId = created.body.data.transfer.id as string;

    const response = await agent.delete(`/api/transfers/${transferId}`);
    expect(response.status).toBe(204);

    const accounts = await agent.get('/api/accounts');
    const source = accounts.body.data.items.find(
      (account: { id: string }) => account.id === sourceId,
    );
    const destination = accounts.body.data.items.find(
      (account: { id: string }) => account.id === destinationId,
    );

    expect(source.balance).toBe(1000);
    expect(destination.balance).toBe(0);

    const transfers = await agent.get('/api/transfers');
    expect(transfers.body.data.total).toBe(0);
  });

  it('no permite eliminar una transferencia de otro usuario', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);
    const created = await createTransfer(agent, sourceId, destinationId);
    const transferId = created.body.data.transfer.id as string;
    const otherUser = await registerAndLogin(app);

    const response = await otherUser.agent.delete(
      `/api/transfers/${transferId}`,
    );

    expect(response.status).toBe(404);
  });

  it('bloquea eliminar una cuenta con transferencias hasta borrarlas', async () => {
    const { agent, sourceId, destinationId } = await setupAccounts(app);
    const created = await createTransfer(agent, sourceId, destinationId);
    const transferId = created.body.data.transfer.id as string;

    const blocked = await agent.delete(`/api/accounts/${destinationId}`);
    expect(blocked.status).toBe(409);
    expect(blocked.body.error.code).toBe('ACCOUNT_HAS_REFERENCES');

    await agent.delete(`/api/transfers/${transferId}`);
    const deleted = await agent.delete(`/api/accounts/${destinationId}`);
    expect(deleted.status).toBe(204);
  });
});
