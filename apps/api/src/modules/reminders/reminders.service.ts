import { pool, withTransaction } from '../../database/pool';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type {
  ReminderId,
  ReminderOccurrence,
  ReminderRecurrence,
  ReminderRecurrenceUnit,
  UserId,
} from '@meridia/shared';
import * as remindersRepository from './reminders.repository';
import type {
  CreateReminderInput,
  ListRemindersQuery,
  UpdateReminderInput,
  UpdateReminderOccurrenceInput,
} from './reminders.schemas';
import { expandOccurrences, isOccurrenceDate } from './reminders.recurrence';

const MAX_TOTAL_OCCURRENCES = 5_000;

interface RecurrenceInput {
  unit: ReminderRecurrenceUnit;
  interval: number;
  endDate?: string | null;
}

const normalizeRecurrence = (
  recurrence: RecurrenceInput | null | undefined,
): ReminderRecurrence | null => {
  if (!recurrence) return null;
  return {
    unit: recurrence.unit,
    interval: recurrence.interval,
    endDate: recurrence.endDate ?? null,
  };
};

const mapRecurrence = (
  row: remindersRepository.ReminderRow,
): ReminderRecurrence | null => {
  if (!row.recurrence_unit || !row.recurrence_interval) return null;
  return {
    unit: row.recurrence_unit,
    interval: row.recurrence_interval,
    endDate: row.recurrence_end_date,
  };
};

const assertScheduleValid = (
  startDate: string,
  recurrence: ReminderRecurrence | null,
): void => {
  if (!recurrence?.endDate) return;
  if (recurrence.endDate < startDate) {
    throw new ValidationError(
      'La fecha de fin debe ser posterior o igual a la fecha de inicio',
      { code: 'INVALID_RECURRENCE_RANGE' },
    );
  }
};

const getReminderRow = async (
  userId: UserId,
  id: ReminderId,
): Promise<remindersRepository.ReminderRow> => {
  const row = await remindersRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Recordatorio no encontrado');
  return row;
};

const buildOccurrence = (
  reminder: remindersRepository.ReminderRow,
  occurrenceDate: string,
  override?: remindersRepository.ReminderOccurrenceRow,
): ReminderOccurrence | null => {
  if (override?.status === 'cancelled') return null;

  const isPaid = override?.status === 'paid';

  return {
    reminderId: reminder.id as ReminderId,
    occurrenceDate,
    date: override?.scheduled_date ?? occurrenceDate,
    title: override?.title ?? reminder.title,
    seriesTitle: reminder.title,
    seriesStartDate: reminder.start_date,
    status: isPaid ? 'paid' : 'pending',
    paidAt:
      isPaid && override?.paid_at ? override.paid_at.toISOString() : null,
    recurrence: mapRecurrence(reminder),
  };
};

export const listReminders = async (
  userId: UserId,
  filters: ListRemindersQuery,
) => {
  const reminders = await remindersRepository.listCandidates(
    pool,
    userId,
    filters.from,
    filters.to,
  );
  if (reminders.length === 0) {
    return { items: [], total: 0 };
  }

  const overrides = await remindersRepository.listOverrides(
    pool,
    reminders.map((reminder) => reminder.id),
    filters.from,
    filters.to,
  );

  const remindersById = new Map(
    reminders.map((reminder) => [reminder.id, reminder]),
  );
  const overridesByReminder = new Map<
    string,
    Map<string, remindersRepository.ReminderOccurrenceRow>
  >();

  for (const override of overrides) {
    const byDate =
      overridesByReminder.get(override.reminder_id) ??
      new Map<string, remindersRepository.ReminderOccurrenceRow>();
    byDate.set(override.occurrence_date, override);
    overridesByReminder.set(override.reminder_id, byDate);
  }

  const items: ReminderOccurrence[] = [];
  const seen = new Set<string>();

  for (const reminder of reminders) {
    const dates = expandOccurrences(
      remindersRepository.toSchedule(reminder),
      filters.from,
      filters.to,
    );
    const overridesForReminder = overridesByReminder.get(reminder.id);

    for (const occurrenceDate of dates) {
      const occurrence = buildOccurrence(
        reminder,
        occurrenceDate,
        overridesForReminder?.get(occurrenceDate),
      );
      if (!occurrence) continue;
      if (occurrence.date < filters.from || occurrence.date > filters.to) {
        continue;
      }
      items.push(occurrence);
      seen.add(`${reminder.id}:${occurrenceDate}`);
    }
  }

  for (const override of overrides) {
    const key = `${override.reminder_id}:${override.occurrence_date}`;
    if (seen.has(key)) continue;

    const reminder = remindersById.get(override.reminder_id);
    if (!reminder) continue;

    const occurrence = buildOccurrence(
      reminder,
      override.occurrence_date,
      override,
    );
    if (!occurrence) continue;
    if (occurrence.date < filters.from || occurrence.date > filters.to) {
      continue;
    }
    items.push(occurrence);
  }

  if (items.length > MAX_TOTAL_OCCURRENCES) {
    throw new ValidationError(
      'El rango contiene demasiados recordatorios. Reduce el rango de fechas.',
      { code: 'REMINDERS_RANGE_TOO_LARGE' },
    );
  }

  items.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.title !== b.title) return a.title.localeCompare(b.title, 'es');
    return a.reminderId.localeCompare(b.reminderId);
  });

  return { items, total: items.length };
};

export const createReminder = async (
  userId: UserId,
  input: CreateReminderInput,
) => {
  const recurrence = normalizeRecurrence(input.recurrence);
  assertScheduleValid(input.date, recurrence);

  const row = await remindersRepository.create(pool, userId, {
    title: input.title,
    startDate: input.date,
    recurrenceUnit: recurrence?.unit ?? null,
    recurrenceInterval: recurrence?.interval ?? null,
    recurrenceEndDate: recurrence?.endDate ?? null,
  });

  return remindersRepository.mapReminderRow(row);
};

export const updateReminder = async (
  userId: UserId,
  id: ReminderId,
  input: UpdateReminderInput,
) => {
  const existing = await getReminderRow(userId, id);
  const nextStartDate = input.date ?? existing.start_date;
  const nextRecurrence =
    input.recurrence === undefined
      ? mapRecurrence(existing)
      : normalizeRecurrence(input.recurrence);

  assertScheduleValid(nextStartDate, nextRecurrence);

  const data: remindersRepository.UpdateReminderData = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.date !== undefined) data.startDate = input.date;
  if (input.recurrence !== undefined) {
    data.recurrenceUnit = nextRecurrence?.unit ?? null;
    data.recurrenceInterval = nextRecurrence?.interval ?? null;
    data.recurrenceEndDate = nextRecurrence?.endDate ?? null;
  }

  const geometryChanged =
    input.date !== undefined || input.recurrence !== undefined;

  const row = await withTransaction(async (client) => {
    const updated = await remindersRepository.update(client, userId, id, data);
    if (!updated) throw new NotFoundError('Recordatorio no encontrado');

    if (geometryChanged) {
      const overrides = await remindersRepository.listAllOverrides(client, id);
      const schedule = remindersRepository.toSchedule(updated);
      const invalidIds = overrides
        .filter((override) => !isOccurrenceDate(schedule, override.occurrence_date))
        .map((override) => override.id);
      await remindersRepository.removeOverridesByIds(client, invalidIds);
    }

    return updated;
  });

  return remindersRepository.mapReminderRow(row);
};

export const updateReminderOccurrence = async (
  userId: UserId,
  id: ReminderId,
  occurrenceDate: string,
  input: UpdateReminderOccurrenceInput,
) => {
  const reminder = await getReminderRow(userId, id);
  const schedule = remindersRepository.toSchedule(reminder);

  if (!isOccurrenceDate(schedule, occurrenceDate)) {
    throw new NotFoundError('Fecha del recordatorio no encontrada');
  }

  const existing = await remindersRepository.findOverride(
    pool,
    userId,
    id,
    occurrenceDate,
  );

  const nextStatus =
    input.status ?? (existing?.status === 'paid' ? 'paid' : 'pending');
  const paidAt =
    nextStatus === 'paid'
      ? existing?.status === 'paid' && existing.paid_at
        ? existing.paid_at
        : new Date()
      : null;
  const scheduledDate =
    input.date !== undefined
      ? input.date === occurrenceDate
        ? null
        : input.date
      : existing?.scheduled_date ?? null;
  const title =
    input.title !== undefined ? input.title : existing?.title ?? null;

  const row = await remindersRepository.upsertOccurrence(
    pool,
    id,
    occurrenceDate,
    {
      scheduledDate,
      title,
      status: nextStatus,
      paidAt,
    },
  );

  const occurrence = buildOccurrence(reminder, occurrenceDate, row);
  if (!occurrence) throw new NotFoundError('Recordatorio no encontrado');
  return occurrence;
};

export const deleteReminder = async (
  userId: UserId,
  id: ReminderId,
): Promise<void> => {
  const removed = await remindersRepository.remove(pool, userId, id);
  if (!removed) throw new NotFoundError('Recordatorio no encontrado');
};

export const deleteReminderOccurrence = async (
  userId: UserId,
  id: ReminderId,
  occurrenceDate: string,
): Promise<void> => {
  const reminder = await getReminderRow(userId, id);

  if (!reminder.recurrence_unit || !reminder.recurrence_interval) {
    if (occurrenceDate !== reminder.start_date) {
      throw new NotFoundError('Fecha del recordatorio no encontrada');
    }
    await remindersRepository.remove(pool, userId, id);
    return;
  }

  const schedule = remindersRepository.toSchedule(reminder);
  if (!isOccurrenceDate(schedule, occurrenceDate)) {
    throw new NotFoundError('Fecha del recordatorio no encontrada');
  }

  const existing = await remindersRepository.findOverride(
    pool,
    userId,
    id,
    occurrenceDate,
  );

  await remindersRepository.upsertOccurrence(pool, id, occurrenceDate, {
    scheduledDate: existing?.scheduled_date ?? null,
    title: existing?.title ?? null,
    status: 'cancelled',
    paidAt: null,
  });
};
