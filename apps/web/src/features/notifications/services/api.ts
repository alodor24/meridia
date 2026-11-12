import type { AppNotification } from "@meridia/shared";
import { ENDPOINT_ROUTES } from "@/consts";
import { http } from "@/services/api/client";
import type { NotificationFilters, NotificationListResponse } from "../types";

export const notificationApi = {
  listNotifications: (filters: NotificationFilters = {}) =>
    http.get<NotificationListResponse>(ENDPOINT_ROUTES.NOTIFICATIONS, {
      params: {
        ...(filters.limit ? { limit: filters.limit } : {}),
        ...(filters.unreadOnly ? { unreadOnly: "true" } : {}),
      },
    }),

  markRead: async (id: string) => {
    const result = await http.patch<{ notification: AppNotification }>(
      `${ENDPOINT_ROUTES.NOTIFICATIONS}/${id}/read`,
    );
    return result.notification;
  },

  markAllRead: () =>
    http.post<{ marked: number }>(`${ENDPOINT_ROUTES.NOTIFICATIONS}/read-all`),
};
