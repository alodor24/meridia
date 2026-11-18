import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import ReminderDayPanel from "../components/ReminderDayPanel";
import { ReminderFormDialog } from "../components/ReminderFormDialog";
import { ReminderOccurrenceFormDialog } from "../components/ReminderOccurrenceFormDialog";
import ReminderScheduler from "../components/ReminderScheduler";
import ReminderUpcoming from "../components/ReminderUpcoming";
import { SHADOW } from "@/theme/globalStyles";
import useCalendar from "../hooks/useCalendar";
import { useDeleteReminder } from "../hooks/useDeleteReminder";
import { useDeleteReminderOccurrence } from "../hooks/useDeleteReminderOccurrence";
import { getDeleteConfirmationContent } from "../utils/getDeleteConfirmationContent";
import LegendDot from "../components/LegendDot";

interface CalendarPageProps {
  focusDate?: string;
}

const CalendarPage = ({ focusDate }: CalendarPageProps) => {
  useDocumentTitle("Calendario");
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: deleteReminder, isPending: isDeletingSeries } =
    useDeleteReminder();
  const {
    mutateAsync: deleteReminderOccurrence,
    isPending: isDeletingOccurrence,
  } = useDeleteReminderOccurrence();
  const {
    deleting,
    setDeleting,
    handleAdd,
    remindersQuery,
    view,
    visibleDate,
    todayKey,
    handleViewChange,
    handleVisibleDateChange,
    handleOccurrenceClick,
    handleCreateAt,
    selectedDate,
    selectedOccurrences,
    handleEditOccurrence,
    handleEditSeries,
    handleDeleteOccurrence,
    handleDeleteSeries,
    upcomingQuery,
    handleUpcomingSelect,
    formOpen,
    editingSeries,
    selectedDateKey,
    setFormOpen,
    editingOccurrence,
    setEditingOccurrence,
  } = useCalendar({
    focusDate,
  });

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
            <CardContent sx={{ p: 3 }}>
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
                <LegendDot color="error.main" label="Vencido" />
                <LegendDot color="warning.main" label="Pendiente" />
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
        title={getDeleteConfirmationContent(deleting).deleteTitle}
        description={getDeleteConfirmationContent(deleting).deleteDescription}
        confirmLabel="Eliminar"
        loading={isDeletingSeries || isDeletingOccurrence}
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};

export default CalendarPage;
