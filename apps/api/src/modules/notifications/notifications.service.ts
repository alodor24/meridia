import type { NotificationId, UserId } from '@meridia/shared';
import { pool } from '../../database/pool';
import { NotFoundError } from '../../shared/errors';
import * as notificationsRepository from './notifications.repository';
import type { ListNotificationsQuery } from './notifications.schemas';

export const listNotifications = async (
  userId: UserId,
  filters: ListNotificationsQuery,
) => {
  const [items, total, unreadCount] = await Promise.all([
    notificationsRepository.list(pool, userId, filters),
    notificationsRepository.count(pool, userId, filters),
    notificationsRepository.countUnread(pool, userId),
  ]);

  return {
    items: items.map(notificationsRepository.mapNotificationRow),
    total,
    unreadCount,
  };
};

export const markNotificationRead = async (
  userId: UserId,
  id: NotificationId,
) => {
  const row = await notificationsRepository.markRead(pool, userId, id);
  if (!row) throw new NotFoundError('Notificación no encontrada');
  return notificationsRepository.mapNotificationRow(row);
};

export const markAllNotificationsRead = async (userId: UserId) => {
  const marked = await notificationsRepository.markAllRead(pool, userId);
  return { marked };
};
