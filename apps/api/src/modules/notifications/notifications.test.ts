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

const setupCompletedGoal = async (): Promise<{
  agent: Agent;
  notificationId: string;
}> => {
  const { agent } = await registerAndLogin(app);

  const savings = await agent
    .post('/api/accounts')
    .send({ name: 'Ahorro', type: 'savings', currency: 'ARS' });
  const savingsId = savings.body.data.account.id as string;

  const categories = await agent.get('/api/categories');
  const incomeCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === 'income',
  );

  const goal = await agent.post('/api/goals').send({
    accountId: savingsId,
    name: 'Auto',
    targetAmount: 500,
  });

  await agent.post('/api/transactions').send({
    accountId: savingsId,
    categoryId: incomeCategory.id,
    type: 'income',
    amount: 500,
    date: today,
  });

  await agent
    .post(`/api/goals/${goal.body.data.goal.id}/contributions`)
    .send({ amount: 500 });

  const notifications = await agent.get('/api/notifications');
  return {
    agent,
    notificationId: notifications.body.data.items[0].id as string,
  };
};

describe('GET /api/notifications', () => {
  it('lista las notificaciones con el conteo de no leídas', async () => {
    const { agent } = await setupCompletedGoal();

    const response = await agent.get('/api/notifications');

    expect(response.status).toBe(200);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.unreadCount).toBe(1);
    expect(response.body.data.items[0]).toMatchObject({
      type: 'goal_completed',
      readAt: null,
    });
    expect(response.body.data.items[0].title).toContain('Meta completada');
  });

  it('filtra solo las no leídas', async () => {
    const { agent, notificationId } = await setupCompletedGoal();
    await agent.patch(`/api/notifications/${notificationId}/read`);

    const all = await agent.get('/api/notifications');
    expect(all.body.data.total).toBe(1);

    const unread = await agent.get('/api/notifications?unreadOnly=true');
    expect(unread.body.data.total).toBe(0);
    expect(unread.body.data.unreadCount).toBe(0);
  });

  it('no mezcla notificaciones de otros usuarios', async () => {
    await setupCompletedGoal();
    const other = await registerAndLogin(app);

    const response = await other.agent.get('/api/notifications');

    expect(response.status).toBe(200);
    expect(response.body.data.total).toBe(0);
    expect(response.body.data.unreadCount).toBe(0);
  });

  it('rechaza sin autenticación', async () => {
    const response = await request(app).get('/api/notifications');
    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/notifications/:id/read', () => {
  it('marca una notificación como leída', async () => {
    const { agent, notificationId } = await setupCompletedGoal();

    const response = await agent.patch(
      `/api/notifications/${notificationId}/read`,
    );

    expect(response.status).toBe(200);
    expect(response.body.data.notification.readAt).toBeTypeOf('string');

    const list = await agent.get('/api/notifications');
    expect(list.body.data.unreadCount).toBe(0);
  });

  it('no permite marcar como leída una notificación de otro usuario', async () => {
    const { notificationId } = await setupCompletedGoal();
    const other = await registerAndLogin(app);

    const response = await other.agent.patch(
      `/api/notifications/${notificationId}/read`,
    );

    expect(response.status).toBe(404);
  });
});

describe('POST /api/notifications/read-all', () => {
  it('marca todas las notificaciones como leídas', async () => {
    const { agent } = await setupCompletedGoal();

    const response = await agent.post('/api/notifications/read-all');
    expect(response.status).toBe(200);
    expect(response.body.data.marked).toBe(1);

    const list = await agent.get('/api/notifications');
    expect(list.body.data.unreadCount).toBe(0);
    expect(list.body.data.items[0].readAt).toBeTypeOf('string');
  });
});
