import type {
  ReminderOccurrence,
  ReminderOccurrenceStatus,
  ReminderRecurrence,
} from "@meridia/shared";

export const SCHEDULER_VIEWS = ["month", "week", "agenda"] as const;
export type SchedulerView = (typeof SCHEDULER_VIEWS)[number];

export const NOTIFICATION_WINDOW_DAYS = 3;
export const NOTIFICATION_LIST_LIMIT = 8;

export interface ReminderFilters {
  from: string;
  to: string;
}

export interface CreateReminderPayload {
  title: string;
  date: string;
  recurrence?: ReminderRecurrence | null;
}

export interface UpdateReminderPayload {
  title?: string;
  date?: string;
  recurrence?: ReminderRecurrence | null;
}

export interface UpdateReminderOccurrencePayload {
  title?: string;
  date?: string;
  status?: ReminderOccurrenceStatus;
}

export interface ReminderFormValues {
  title: string;
  date: string;
  repeat: boolean;
  unit: ReminderRecurrence["unit"];
  interval: string;
  endDate: string;
}

export interface ReminderNotificationSummary {
  items: ReminderOccurrence[];
  total: number;
  todayCount: number;
  upcomingCount: number;
}

export type DeleteScope = "occurrence" | "series";

export interface DeletingReminder {
  occurrence: ReminderOccurrence;
  scope: DeleteScope;
}
