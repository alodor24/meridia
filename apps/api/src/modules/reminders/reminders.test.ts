import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { truncateAll } from '../../test/db';
import { registerAndLogin } from '../../test/helpers';

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

type Agent = ReturnType<(typeof import('supertest'))['agent']>;

interface Ctx {
  agent: Agent;
}

const setupUser = async (): Promise<Ctx> => {
  const { agent } = await registerAndLogin(app);
  return { agent };
};

const createReminder = (
  agent: Agent,
  overrides: Record<string, unknown> = {},
) =>
  agent.post('/api/reminders').send({
    title: 'Alquiler',
    date: '2026-10-23',
    ...overrides,
  });

const listReminders = (
  agent: Agent,
  from = '2026-10-01',
  to = '2026-10-31',
) => agent.get('/api/reminders').query({ from, to });

const listDates = async (
  agent: Agent,
  from: string,
  to: string,
): Promise<string[]> => {
  const response = await listReminders(agent, from, to);
  expect(response.status).toBe(200);
  return response.body.data.items.map(
    (item: { date: string }) => item.date,
  );
};

describe('POST /api/reminders', () => {
  it('crea un recordatorio único y lo lista en su fecha', async () => {
    const ctx = await setupUser();

    const response = await createReminder(ctx.agent);
    expect(response.status).toBe(201);
    expect(response.body.data.reminder).toMatchObject({
      title: 'Alquiler',
      startDate: '2026-10-23',
      recurrence: null,
    });

    const list = await listReminders(ctx.agent);
    expect(list.status).toBe(200);
    expect(list.body.data.total).toBe(1);
    expect(list.body.data.items[0]).toMatchObject({
      occurrenceDate: '2026-10-23',
      date: '2026-10-23',
      title: 'Alquiler',
      status: 'pending',
      recurrence: null,
    });
  });

  it('crea una recurrencia mensual y genera todas las fechas', async () => {
    const ctx = await setupUser();

    await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });

    expect(
      await listDates(ctx.agent, '2026-10-01', '2026-12-31'),
    ).toEqual(['2026-10-23', '2026-11-23', '2026-12-23']);
  });

  it('respeta intervalos personalizados y fecha de fin', async () => {
    const ctx = await setupUser();

    await createReminder(ctx.agent, {
      date: '2026-10-05',
      recurrence: {
        unit: 'week',
        interval: 2,
        endDate: '2026-11-05',
      },
    });

    expect(
      await listDates(ctx.agent, '2026-10-01', '2026-12-31'),
    ).toEqual(['2026-10-05', '2026-10-19', '2026-11-02']);
  });

  it('rechaza títulos vacíos y recurrencias inválidas', async () => {
    const ctx = await setupUser();

    const emptyTitle = await createReminder(ctx.agent, { title: '   ' });
    expect(emptyTitle.status).toBe(400);

    const badInterval = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 0 },
    });
    expect(badInterval.status).toBe(400);

    const badEndDate = await createReminder(ctx.agent, {
      recurrence: {
        unit: 'month',
        interval: 1,
        endDate: '2026-10-01',
      },
    });
    expect(badEndDate.status).toBe(400);
  });
});

describe('GET /api/reminders', () => {
  it('exige un rango válido y acotado', async () => {
    const ctx = await setupUser();

    const missingRange = await ctx.agent.get('/api/reminders');
    expect(missingRange.status).toBe(400);

    const inverted = await listReminders(ctx.agent, '2026-10-31', '2026-10-01');
    expect(inverted.status).toBe(400);

    const tooLarge = await listReminders(
      ctx.agent,
      '2026-01-01',
      '2027-01-02',
    );
    expect(tooLarge.status).toBe(400);
  });

  it('no mezcla recordatorios de otros usuarios', async () => {
    const owner = await setupUser();
    const other = await setupUser();

    await createReminder(owner.agent);
    const list = await listReminders(other.agent);
    expect(list.body.data.total).toBe(0);
  });
});

describe('PATCH /api/reminders/:id/occurrences/:occurrenceDate', () => {
  it('marca pagada solo una ocurrencia', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ status: 'paid' });

    expect(response.status).toBe(200);
    expect(response.body.data.occurrence).toMatchObject({
      occurrenceDate: '2026-10-23',
      status: 'paid',
    });
    expect(response.body.data.occurrence.paidAt).toBeTruthy();

    const list = await listReminders(ctx.agent);
    expect(list.body.data.items[0].status).toBe('paid');

    const november = await listReminders(
      ctx.agent,
      '2026-11-01',
      '2026-11-30',
    );
    expect(november.body.data.items[0].status).toBe('pending');
  });

  it('permite volver a dejar pendiente una ocurrencia', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent);
    const id = created.body.data.reminder.id as string;

    await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ status: 'paid' });

    const response = await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ status: 'pending' });

    expect(response.status).toBe(200);
    expect(response.body.data.occurrence.status).toBe('pending');
    expect(response.body.data.occurrence.paidAt).toBeNull();
  });

  it('edita solo el título y la fecha de una ocurrencia', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ title: 'Alquiler de octubre', date: '2026-10-25' });

    expect(response.status).toBe(200);
    expect(response.body.data.occurrence).toMatchObject({
      occurrenceDate: '2026-10-23',
      date: '2026-10-25',
      title: 'Alquiler de octubre',
      seriesTitle: 'Alquiler',
    });

    const list = await listReminders(ctx.agent);
    expect(list.body.data.items).toHaveLength(1);
    expect(list.body.data.items[0].date).toBe('2026-10-25');

    const november = await listReminders(
      ctx.agent,
      '2026-11-01',
      '2026-11-30',
    );
    expect(november.body.data.items[0]).toMatchObject({
      date: '2026-11-23',
      title: 'Alquiler',
    });
  });

  it('mueve una ocurrencia fuera del rango y la muestra en el rango destino', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent);
    const id = created.body.data.reminder.id as string;

    await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ date: '2026-11-02' });

    expect(await listDates(ctx.agent, '2026-10-01', '2026-10-31')).toEqual(
      [],
    );
    expect(await listDates(ctx.agent, '2026-11-01', '2026-11-30')).toEqual([
      '2026-11-02',
    ]);
  });

  it('rechaza fechas que no pertenecen a la serie', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-24`)
      .send({ status: 'paid' });

    expect(response.status).toBe(404);
  });

  it('no permite modificar recordatorios de otro usuario', async () => {
    const owner = await setupUser();
    const other = await setupUser();
    const created = await createReminder(owner.agent);
    const id = created.body.data.reminder.id as string;

    const response = await other.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ status: 'paid' });

    expect(response.status).toBe(404);
  });
});

describe('PATCH /api/reminders/:id', () => {
  it('actualiza toda la serie sin perder excepciones válidas', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ title: 'Octubre', status: 'paid' });

    const response = await ctx.agent
      .patch(`/api/reminders/${id}`)
      .send({ title: 'Alquiler actualizado' });

    expect(response.status).toBe(200);
    expect(response.body.data.reminder.title).toBe('Alquiler actualizado');

    const october = await listReminders(ctx.agent);
    expect(october.body.data.items[0]).toMatchObject({
      title: 'Octubre',
      status: 'paid',
      seriesTitle: 'Alquiler actualizado',
    });

    const november = await listReminders(
      ctx.agent,
      '2026-11-01',
      '2026-11-30',
    );
    expect(november.body.data.items[0]).toMatchObject({
      title: 'Alquiler actualizado',
      status: 'pending',
    });
  });

  it('descarta excepciones que dejan de ser fechas válidas', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    await ctx.agent
      .patch(`/api/reminders/${id}/occurrences/2026-10-23`)
      .send({ status: 'paid' });

    await ctx.agent.patch(`/api/reminders/${id}`).send({
      date: '2026-10-15',
      recurrence: { unit: 'month', interval: 1 },
    });

    const list = await listReminders(ctx.agent);
    expect(list.body.data.items[0]).toMatchObject({
      date: '2026-10-15',
      status: 'pending',
    });
  });

  it('puede convertir una serie en un recordatorio único', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent
      .patch(`/api/reminders/${id}`)
      .send({ recurrence: null });

    expect(response.status).toBe(200);
    expect(response.body.data.reminder.recurrence).toBeNull();
    expect(
      await listDates(ctx.agent, '2026-10-01', '2026-12-31'),
    ).toEqual(['2026-10-23']);
  });

  it('valida el rango al editar la recurrencia', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent.patch(`/api/reminders/${id}`).send({
      date: '2026-12-01',
      recurrence: {
        unit: 'month',
        interval: 1,
        endDate: '2026-11-01',
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.error.details.code).toBe('INVALID_RECURRENCE_RANGE');
  });
});

describe('DELETE /api/reminders', () => {
  it('elimina solo una ocurrencia de una serie', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent.delete(
      `/api/reminders/${id}/occurrences/2026-10-23`,
    );
    expect(response.status).toBe(204);

    expect(
      await listDates(ctx.agent, '2026-10-01', '2026-12-31'),
    ).toEqual(['2026-11-23', '2026-12-23']);
  });

  it('elimina el recordatorio completo al borrar su única fecha', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent);
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent.delete(
      `/api/reminders/${id}/occurrences/2026-10-23`,
    );
    expect(response.status).toBe(204);
    expect((await listReminders(ctx.agent)).body.data.total).toBe(0);

    const update = await ctx.agent
      .patch(`/api/reminders/${id}`)
      .send({ title: 'Otro' });
    expect(update.status).toBe(404);
  });

  it('elimina toda la serie', async () => {
    const ctx = await setupUser();
    const created = await createReminder(ctx.agent, {
      recurrence: { unit: 'month', interval: 1 },
    });
    const id = created.body.data.reminder.id as string;

    const response = await ctx.agent.delete(`/api/reminders/${id}`);
    expect(response.status).toBe(204);
    expect(
      await listDates(ctx.agent, '2026-10-01', '2026-12-31'),
    ).toEqual([]);
  });

  it('no permite eliminar recordatorios de otro usuario', async () => {
    const owner = await setupUser();
    const other = await setupUser();
    const created = await createReminder(owner.agent);
    const id = created.body.data.reminder.id as string;

    expect((await other.agent.delete(`/api/reminders/${id}`)).status).toBe(
      404,
    );
  });
});
