import { differenceInCalendarDays, parseISO } from "date-fns";
import type { ReminderOccurrence } from "@meridia/shared";
import { today } from "@/utils/format";
import { notificationRange } from "./calendarRange";
import {
  NOTIFICATION_LIST_LIMIT,
  NOTIFICATION_WINDOW_DAYS,
  ReminderNotificationSummary,
} from "../types";

interface SelectReminderNotificationsOptions {
  todayKey?: string;
  windowDays?: number;
  limit?: number;
}

export const selectReminderNotifications = (
  occurrences: readonly ReminderOccurrence[],
  {
    todayKey = today(),
    windowDays = NOTIFICATION_WINDOW_DAYS,
    limit = NOTIFICATION_LIST_LIMIT,
  }: SelectReminderNotificationsOptions = {},
): ReminderNotificationSummary => {
  const { from, to } = notificationRange(todayKey, windowDays);

  const pending = occurrences
    .filter(
      (occurrence) =>
        occurrence.status === "pending" &&
        occurrence.date >= from &&
        occurrence.date <= to,
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.title.localeCompare(b.title, "es") ||
        a.reminderId.localeCompare(b.reminderId),
    );

  const todayCount = pending.filter(
    (occurrence) => occurrence.date === todayKey,
  ).length;

  return {
    items: pending.slice(0, limit),
    total: pending.length,
    todayCount,
    upcomingCount: pending.length - todayCount,
  };
};

export const formatNotificationDate = (
  date: string,
  todayKey = today(),
): string => {
  const diff = differenceInCalendarDays(parseISO(date), parseISO(todayKey));

  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  if (diff > 1) return `En ${diff} días`;

  return "Vencido";
};
