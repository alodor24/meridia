import { ReminderNotificationSummary } from "../calendar/types";

export interface ReminderNotificationsData extends ReminderNotificationSummary {
  todayKey: string;
}
