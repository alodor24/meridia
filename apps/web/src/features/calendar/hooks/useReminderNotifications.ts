import { useMemo } from "react";
import { useTodayKey } from "@/hooks/useTodayKey";
import { notificationRange } from "../utils/calendarRange";
import { selectReminderNotifications } from "../utils/notifications";
import { useListReminders } from "./useListReminders";
import { NOTIFICATION_LIST_LIMIT } from "../types";

export const useReminderNotifications = (limit = NOTIFICATION_LIST_LIMIT) => {
  const todayKey = useTodayKey();
  const filters = useMemo(() => notificationRange(todayKey), [todayKey]);
  const query = useListReminders(filters);

  const summary = useMemo(
    () =>
      selectReminderNotifications(query.data?.items ?? [], {
        todayKey,
        limit,
      }),
    [query.data, todayKey, limit],
  );

  return { query, todayKey, ...summary };
};
