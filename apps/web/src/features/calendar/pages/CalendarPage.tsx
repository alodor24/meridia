import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format, isValid, parseISO } from "date-fns";
import type { ReminderOccurrence } from "@meridia/shared";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTodayKey } from "@/hooks/useTodayKey";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { ReminderDayPanel } from "../components/ReminderDayPanel";
import { ReminderFormDialog } from "../components/ReminderFormDialog";
import { ReminderOccurrenceFormDialog } from "../components/ReminderOccurrenceFormDialog";
import { ReminderScheduler } from "../components/ReminderScheduler";
import { ReminderUpcoming } from "../components/ReminderUpcoming";
import { useDeleteReminder } from "../hooks/useDeleteReminder";
import { useDeleteReminderOccurrence } from "../hooks/useDeleteReminderOccurrence";
import { useListReminders } from "../hooks/useListReminders";
import type { SchedulerView } from "../types";
import { schedulerRange, upcomingRange } from "../utils/calendarRange";
import { SHADOW } from "@/theme/globalStyles";

type DeleteScope = "occurrence" | "series";

interface DeletingReminder {
  occurrence: ReminderOccurrence;
  scope: DeleteScope;
}

interface CalendarPageProps {
  focusDate?: string;
}

const parseFocusDate = (focusDate?: string): Date | undefined => {
  if (!focusDate) return undefined;

  const parsed = parseISO(focusDate);
  return isValid(parsed) ? parsed : undefined;
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const CalendarPage = ({ focusDate }: CalendarPageProps) => {
  useDocumentTitle("Calendario");
  const showSnackbar = useUiStore((state) => state.showSnackbar);
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
  const { mutateAsync: deleteReminder, isPending: isDeletingSeries } =
    useDeleteReminder();
  const {
    mutateAsync: deleteReminderOccurrence,
    isPending: isDeletingOccurrence,
  } = useDeleteReminderOccurrence();

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

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    const { occurrence, scope } = deleting;

    try {
      if (scope === "series") {
        await deleteReminder(occurrence.reminderId);
        showSnackbar("Recordatorio eliminado");
      } else {
        await deleteReminderOccurrence({
          reminderId: occurrence.reminderId,
          occurrenceDate: occurrence.occurrenceDate,
        });
        showSnackbar(
          occurrence.recurrence ? "Fecha eliminada" : "Recordatorio eliminado",
        );
      }
      setDeleting(null);
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const deletingSeries = deleting?.scope === "series";
  const deleteTitle = deletingSeries
    ? "Eliminar toda la serie"
    : deleting?.occurrence.recurrence
      ? "Eliminar esta fecha"
      : "Eliminar recordatorio";
  const deleteDescription = deleting
    ? deleting.scope === "series"
      ? `Se eliminarán todas las fechas de la serie "${deleting.occurrence.seriesTitle}".`
      : deleting.occurrence.recurrence
        ? "Se eliminará solo esta fecha. El resto de la serie se mantiene."
        : `¿Eliminar "${deleting.occurrence.title}"?`
    : undefined;

  return (
    <>
      <PageHeader
        title="Calendario"
        subtitle="Registra tus fechas de pago y sus recurrencias."
        actionLabel="Nuevo recordatorio"
        onAction={handleAdd}
      />

      {remindersQuery.error && (
        <ErrorState
          message={remindersQuery.error.message}
          onRetry={() => void remindersQuery.refetch()}
        />
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ boxShadow: SHADOW }}>
            <CardContent>
              <ReminderScheduler
                occurrences={remindersQuery.data?.items ?? []}
                view={view}
                visibleDate={visibleDate}
                todayKey={todayKey}
                loading={remindersQuery.isLoading}
                onViewChange={handleViewChange}
                onVisibleDateChange={handleVisibleDateChange}
                onOccurrenceClick={handleOccurrenceClick}
                onCreateAt={handleCreateAt}
              />
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "center", mt: 1 }}>
                <LegendDot color="warning.main" label="Pendiente" />
                <LegendDot color="error.main" label="Vencido" />
                <LegendDot color="success.main" label="Pagado" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <ReminderDayPanel
              date={selectedDate}
              occurrences={selectedOccurrences}
              todayKey={todayKey}
              onAdd={handleAdd}
              onEditOccurrence={handleEditOccurrence}
              onEditSeries={handleEditSeries}
              onDeleteOccurrence={handleDeleteOccurrence}
              onDeleteSeries={handleDeleteSeries}
            />
            <ReminderUpcoming
              occurrences={upcomingQuery.data?.items ?? []}
              loading={upcomingQuery.isLoading}
              onSelect={handleUpcomingSelect}
            />
          </Stack>
        </Grid>
      </Grid>

      <ReminderFormDialog
        open={formOpen}
        occurrence={editingSeries}
        defaultDate={selectedDateKey}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />

      <ReminderOccurrenceFormDialog
        occurrence={editingOccurrence}
        onClose={() => setEditingOccurrence(null)}
        onSaved={() => setEditingOccurrence(null)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel="Eliminar"
        loading={isDeletingSeries || isDeletingOccurrence}
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default CalendarPage;
