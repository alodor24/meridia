import { useMemo, useState } from "react";
import { useTodayKey } from "@/hooks/useTodayKey";
import { DeletingReminder, SchedulerView } from "../types";
import type { ReminderOccurrence } from "@meridia/shared";
import { schedulerRange, upcomingRange } from "../utils/calendarRange";
import { useListReminders } from "./useListReminders";
import { format, parseISO } from "date-fns";
import { parseFocusDate } from "../utils/parsefocusDate";

const useCalendar = ({ focusDate }: { focusDate?: string }) => {
  const todayKey = useTodayKey();

  const initialFocusDate = useMemo(
    () => parseFocusDate(focusDate),
    [focusDate],
  );
  const [view, setView] = useState<SchedulerView>("month");
  const [visibleDate, setVisibleDate] = useState(
    () => initialFocusDate ?? new Date(),
  );
  const [selectedDate, setSelectedDate] = useState(
    () => initialFocusDate ?? new Date(),
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<ReminderOccurrence | null>(
    null,
  );
  const [editingOccurrence, setEditingOccurrence] =
    useState<ReminderOccurrence | null>(null);
  const [deleting, setDeleting] = useState<DeletingReminder | null>(null);

  const [upcomingFilters] = useState(() => upcomingRange(30));
  const rangeFilters = useMemo(
    () => schedulerRange(visibleDate, view),
    [view, visibleDate],
  );
  const remindersQuery = useListReminders(rangeFilters);
  const upcomingQuery = useListReminders(upcomingFilters);

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");

  const selectedOccurrences = useMemo(
    () =>
      (remindersQuery.data?.items ?? []).filter(
        (occurrence) => occurrence.date === selectedDateKey,
      ),
    [remindersQuery.data, selectedDateKey],
  );

  const handleAdd = () => {
    setEditingSeries(null);
    setFormOpen(true);
  };

  const handleCreateAt = (date: string) => {
    setSelectedDate(parseISO(date));
    setEditingSeries(null);
    setFormOpen(true);
  };

  const handleOccurrenceClick = (occurrence: ReminderOccurrence) => {
    setSelectedDate(parseISO(occurrence.date));
  };

  const handleUpcomingSelect = (occurrence: ReminderOccurrence) => {
    const date = parseISO(occurrence.date);
    setSelectedDate(date);
    setVisibleDate(date);
  };

  const handleViewChange = (nextView: SchedulerView) => {
    setView(nextView);
    setSelectedDate((current) => {
      const { from, to } = schedulerRange(visibleDate, nextView);
      const currentKey = format(current, "yyyy-MM-dd");
      return currentKey >= from && currentKey <= to ? current : visibleDate;
    });
  };

  const handleVisibleDateChange = (nextDate: Date) => {
    setVisibleDate(nextDate);
    setSelectedDate((current) => {
      const { from, to } = schedulerRange(nextDate, view);
      const currentKey = format(current, "yyyy-MM-dd");
      return currentKey >= from && currentKey <= to ? current : nextDate;
    });
  };

  const handleEditOccurrence = (occurrence: ReminderOccurrence) => {
    setEditingOccurrence(occurrence);
  };

  const handleEditSeries = (occurrence: ReminderOccurrence) => {
    setEditingSeries(occurrence);
    setFormOpen(true);
  };

  const handleDeleteOccurrence = (occurrence: ReminderOccurrence) => {
    setDeleting({ occurrence, scope: "occurrence" });
  };

  const handleDeleteSeries = (occurrence: ReminderOccurrence) => {
    setDeleting({ occurrence, scope: "series" });
  };

  return {
    todayKey,
    formOpen,
    setFormOpen,
    editingSeries,
    selectedDateKey,
    editingOccurrence,
    setEditingOccurrence,
    deleting,
    setDeleting,
    upcomingQuery,
    selectedOccurrences,
    handleAdd,
    view,
    visibleDate,
    remindersQuery,
    handleCreateAt,
    selectedDate,
    handleOccurrenceClick,
    handleUpcomingSelect,
    handleViewChange,
    handleVisibleDateChange,
    handleEditOccurrence,
    handleEditSeries,
    handleDeleteOccurrence,
    handleDeleteSeries,
  };
};

export default useCalendar;
