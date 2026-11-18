import type {
  AppNotification,
  GoalId,
  NotificationId,
  NotificationType,
  UserId,
} from '@meridia/shared';
import type { Db } from '../../database/types';
import type { ListNotificationsQuery } from './notifications.schemas';

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  goal_id: string | null;
  title: string;
  message: string;
  read_at: Date | null;
  created_at: Date;
}

export interface CreateNotificationData {
  type: NotificationType;
  goalId: string | null;
  title: string;
  message: string;
}

export const mapNotificationRow = (
  row: NotificationRow,
): AppNotification => ({
  id: row.id as NotificationId,
  type: row.type,
  goalId: row.goal_id as GoalId | null,
  title: row.title,
  message: row.message,
  readAt: row.read_at ? row.read_at.toISOString() : null,
  createdAt: row.created_at.toISOString(),
});

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateNotificationData,
): Promise<NotificationRow> => {
  const result = await db.query<NotificationRow>(
    `INSERT INTO notifications (user_id, type, goal_id, title, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, input.type, input.goalId, input.title, input.message],
  );
  return result.rows[0]!;
};

export const list = async (
  db: Db,
  userId: UserId,
  filters: ListNotificationsQuery,
): Promise<NotificationRow[]> => {
  const conditions = ['user_id = $1'];
  const values: unknown[] = [userId];
  if (filters.unreadOnly) {
    conditions.push('read_at IS NULL');
  }
  values.push(filters.limit);

  const result = await db.query<NotificationRow>(
    `SELECT *
     FROM notifications
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC, id DESC
     LIMIT $${values.length}`,
    values,
  );
  return result.rows;
};

export const count = async (
  db: Db,
  userId: UserId,
  filters: Pick<ListNotificationsQuery, 'unreadOnly'>,
): Promise<number> => {
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM notifications
     WHERE user_id = $1 ${filters.unreadOnly ? 'AND read_at IS NULL' : ''}`,
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const countUnread = async (
  db: Db,
  userId: UserId,
): Promise<number> => {
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM notifications
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const markRead = async (
  db: Db,
  userId: UserId,
  id: NotificationId,
): Promise<NotificationRow | undefined> => {
  const result = await db.query<NotificationRow>(
    `UPDATE notifications
     SET read_at = COALESCE(read_at, now())
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId],
  );
  return result.rows[0];
};

export const markAllRead = async (
  db: Db,
  userId: UserId,
): Promise<number> => {
  const result = await db.query(
    `UPDATE notifications
     SET read_at = now()
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId],
  );
  return result.rowCount ?? 0;
};
