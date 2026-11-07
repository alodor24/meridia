import type { NotificationFilters } from "./types";

export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () => [...notificationKeys.all, "list"] as const,

  list: (filters: NotificationFilters = {}) =>
    [...notificationKeys.lists(), filters] as const,
};
