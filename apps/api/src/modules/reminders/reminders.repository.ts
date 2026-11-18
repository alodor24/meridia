import type {
  Reminder,
  ReminderId,
  ReminderOccurrenceStatus,
  ReminderRecurrenceUnit,
  UserId,
} from '@meridia/shared';
import type { Db } from '../../database/types';
import type { ReminderSchedule } from './reminders.recurrence';

export type ReminderOccurrenceRowStatus = ReminderOccurrenceStatus | 'cancelled';

export interface ReminderRow {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  recurrence_unit: ReminderRecurrenceUnit | null;
  recurrence_interval: number | null;
  recurrence_end_date: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ReminderOccurrenceRow {
  id: string;
  reminder_id: string;
  occurrence_date: string;
  scheduled_date: string | null;
  title: string | null;
  status: ReminderOccurrenceRowStatus;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReminderData {
  title: string;
  startDate: string;
  recurrenceUnit: ReminderRecurrenceUnit | null;
  recurrenceInterval: number | null;
  recurrenceEndDate: string | null;
}

export interface UpdateReminderData {
  title?: string;
  startDate?: string;
  recurrenceUnit?: ReminderRecurrenceUnit | null;
  recurrenceInterval?: number | null;
  recurrenceEndDate?: string | null;
}

export interface UpsertOccurrenceData {
  scheduledDate: string | null;
  title: string | null;
  status: ReminderOccurrenceRowStatus;
  paidAt: Date | null;
}

export const toSchedule = (row: ReminderRow): ReminderSchedule => ({
  startDate: row.start_date,
  recurrenceUnit: row.recurrence_unit,
  recurrenceInterval: row.recurrence_interval,
  recurrenceEndDate: row.recurrence_end_date,
});

export const mapReminderRow = (row: ReminderRow): Reminder => ({
  id: row.id as ReminderId,
  userId: row.user_id as UserId,
  title: row.title,
  startDate: row.start_date,
  recurrence:
    row.recurrence_unit && row.recurrence_interval
      ? {
          unit: row.recurrence_unit,
          interval: row.recurrence_interval,
          endDate: row.recurrence_end_date,
        }
      : null,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export const findById = async (
  db: Db,
  userId: UserId,
  id: ReminderId,
): Promise<ReminderRow | undefined> => {
  const result = await db.query<ReminderRow>(
    'SELECT * FROM reminders WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return result.rows[0];
};

export const listCandidates = async (
  db: Db,
  userId: UserId,
  from: string,
  to: string,
): Promise<ReminderRow[]> => {
  const result = await db.query<ReminderRow>(
    `SELECT r.*
     FROM reminders r
     WHERE r.user_id = $1
       AND (
         (
           r.recurrence_unit IS NOT NULL
           AND r.start_date <= $3
           AND (r.recurrence_end_date IS NULL OR r.recurrence_end_date >= $2)
         )
         OR (r.recurrence_unit IS NULL AND r.start_date BETWEEN $2 AND $3)
         OR EXISTS (
           SELECT 1
           FROM reminder_occurrences o
           WHERE o.reminder_id = r.id
             AND o.scheduled_date BETWEEN $2 AND $3
         )
       )
     ORDER BY r.start_date ASC, r.created_at ASC`,
    [userId, from, to],
  );
  return result.rows;
};

export const listOverrides = async (
  db: Db,
  reminderIds: string[],
  from: string,
  to: string,
): Promise<ReminderOccurrenceRow[]> => {
  if (reminderIds.length === 0) return [];

  const result = await db.query<ReminderOccurrenceRow>(
    `SELECT o.*
     FROM reminder_occurrences o
     WHERE o.reminder_id = ANY($1::uuid[])
       AND (
         o.occurrence_date BETWEEN $2 AND $3
         OR o.scheduled_date BETWEEN $2 AND $3
       )`,
    [reminderIds, from, to],
  );
  return result.rows;
};

export const listAllOverrides = async (
  db: Db,
  reminderId: ReminderId,
): Promise<ReminderOccurrenceRow[]> => {
  const result = await db.query<ReminderOccurrenceRow>(
    'SELECT * FROM reminder_occurrences WHERE reminder_id = $1',
    [reminderId],
  );
  return result.rows;
};

export const findOverride = async (
  db: Db,
  userId: UserId,
  reminderId: ReminderId,
  occurrenceDate: string,
): Promise<ReminderOccurrenceRow | undefined> => {
  const result = await db.query<ReminderOccurrenceRow>(
    `SELECT o.*
     FROM reminder_occurrences o
     JOIN reminders r ON r.id = o.reminder_id
     WHERE o.reminder_id = $1
       AND o.occurrence_date = $2
       AND r.user_id = $3`,
    [reminderId, occurrenceDate, userId],
  );
  return result.rows[0];
};

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateReminderData,
): Promise<ReminderRow> => {
  const result = await db.query<ReminderRow>(
    `INSERT INTO reminders (
       user_id, title, start_date,
       recurrence_unit, recurrence_interval, recurrence_end_date
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      input.title,
      input.startDate,
      input.recurrenceUnit,
      input.recurrenceInterval,
      input.recurrenceEndDate,
    ],
  );
  return result.rows[0]!;
};

export const update = async (
  db: Db,
  userId: UserId,
  id: ReminderId,
  input: UpdateReminderData,
): Promise<ReminderRow | undefined> => {
  const fields: string[] = [];
  const values: unknown[] = [id, userId];
  const set = (column: string, value: unknown) => {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  };

  if (input.title !== undefined) set('title', input.title);
  if (input.startDate !== undefined) set('start_date', input.startDate);
  if (input.recurrenceUnit !== undefined) {
    set('recurrence_unit', input.recurrenceUnit);
  }
  if (input.recurrenceInterval !== undefined) {
    set('recurrence_interval', input.recurrenceInterval);
  }
  if (input.recurrenceEndDate !== undefined) {
    set('recurrence_end_date', input.recurrenceEndDate);
  }

  if (fields.length === 0) return undefined;

  const result = await db.query<ReminderRow>(
    `UPDATE reminders
     SET ${fields.join(', ')}
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    values,
  );
  return result.rows[0];
};

export const remove = async (
  db: Db,
  userId: UserId,
  id: ReminderId,
): Promise<boolean> => {
  const result = await db.query(
    'DELETE FROM reminders WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
};

export const upsertOccurrence = async (
  db: Db,
  reminderId: ReminderId,
  occurrenceDate: string,
  input: UpsertOccurrenceData,
): Promise<ReminderOccurrenceRow> => {
  const result = await db.query<ReminderOccurrenceRow>(
    `INSERT INTO reminder_occurrences (
       reminder_id, occurrence_date, scheduled_date, title, status, paid_at
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (reminder_id, occurrence_date) DO UPDATE
     SET scheduled_date = EXCLUDED.scheduled_date,
         title = EXCLUDED.title,
         status = EXCLUDED.status,
         paid_at = EXCLUDED.paid_at
     RETURNING *`,
    [
      reminderId,
      occurrenceDate,
      input.scheduledDate,
      input.title,
      input.status,
      input.paidAt,
    ],
  );
  return result.rows[0]!;
};

export const removeOverridesByIds = async (
  db: Db,
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) return;
  await db.query('DELETE FROM reminder_occurrences WHERE id = ANY($1::uuid[])', [
    ids,
  ]);
};
