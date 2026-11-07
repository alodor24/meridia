import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "../notificationKeys";
import { notificationApi } from "../services/api";
import type { NotificationFilters } from "../types";

export const useNotifications = (filters: NotificationFilters = {}) =>
  useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationApi.listNotifications(filters),
    refetchInterval: 60_000,
  });
