import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import type { ReminderFilters, SchedulerView } from "../types";

export const schedulerRange = (
  visibleDate: Date,
  view: SchedulerView,
): ReminderFilters => {
  if (view === "agenda") {
    return {
      from: format(visibleDate, "yyyy-MM-dd"),
      to: format(addDays(visibleDate, 29), "yyyy-MM-dd"),
    };
  }

  return {
    from: format(
      startOfWeek(startOfMonth(visibleDate), { locale: es }),
      "yyyy-MM-dd",
    ),
    to: format(
      endOfWeek(endOfMonth(visibleDate), { locale: es }),
      "yyyy-MM-dd",
    ),
  };
};

export const upcomingRange = (days = 30): ReminderFilters => {
  const today = new Date();
  return {
    from: format(today, "yyyy-MM-dd"),
    to: format(addDays(today, days), "yyyy-MM-dd"),
  };
};

export const notificationRange = (
  todayKey: string,
  days = 3,
): ReminderFilters => ({
  from: todayKey,
  to: format(addDays(parseISO(todayKey), days), "yyyy-MM-dd"),
});
