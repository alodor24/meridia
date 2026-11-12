import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications } from "./useNotifications";
import { useReminderNotifications } from "@/features/calendar/hooks/useReminderNotifications";
import { PATHS } from "@/consts";
import { pluralize } from "../utils/helper";
import { NOTIFICATION_LIST_LIMIT } from "@/features/calendar/types";

const useNotificationsBell = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const reminderNotifications = useReminderNotifications();
  const notificationsQuery = useNotifications({
    limit: NOTIFICATION_LIST_LIMIT,
  });

  const open = Boolean(anchorEl);
  const closePopover = () => setAnchorEl(null);

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;
  const total = unreadCount + reminderNotifications.total;

  const openOccurrence = (date: string) => {
    closePopover();
    void navigate({ to: PATHS.CALENDAR, search: { date } });
  };

  const openCalendar = () => {
    closePopover();
    void navigate({ to: PATHS.CALENDAR, search: {} });
  };

  const ariaLabel =
    total === 0
      ? "Notificaciones: no hay novedades"
      : `Notificaciones: ${total} ${pluralize(total, "novedad", "novedades")}`;

  const isLoading = reminderNotifications.query.isLoading;

  return {
    anchorEl,
    open,
    closePopover,
    reminderNotifications,
    isLoading,
    onOccurrenceClick: openOccurrence,
    total,
    ariaLabel,
    openCalendar,
    setAnchorEl,
    notificationsQuery,
    unreadCount,
  };
};

export default useNotificationsBell;
