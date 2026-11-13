import type { ReminderFilters } from "./types";

export const reminderKeys = {
  all: ["reminders"] as const,
  lists: () => [...reminderKeys.all, "list"] as const,
  list: (filters: ReminderFilters) =>
    [...reminderKeys.lists(), filters] as const,
};
