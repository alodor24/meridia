import type { AppNotification } from "@meridia/shared";
import { ReminderNotificationSummary } from "../calendar/types";

export interface NotificationFilters {
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  items: AppNotification[];
  total: number;
  unreadCount: number;
}

export interface ReminderNotificationsData extends ReminderNotificationSummary {
  todayKey: string;
}
