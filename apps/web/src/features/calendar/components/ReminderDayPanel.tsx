import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { ReminderOccurrence } from "@meridia/shared";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { formatDate } from "@/utils/format";
import { useUpdateReminderOccurrence } from "../hooks/useUpdateReminderOccurrence";
import { formatRecurrence } from "../utils/recurrence";
import { isReminderOverdue } from "../utils/reminderStatus";
import { SHADOW } from "@/theme/globalStyles";

export interface ReminderDayPanelProps {
  date: Date;
  occurrences: ReminderOccurrence[];
  todayKey: string;
  onAdd: () => void;
  onEditOccurrence: (occurrence: ReminderOccurrence) => void;
  onEditSeries: (occurrence: ReminderOccurrence) => void;
  onDeleteOccurrence: (occurrence: ReminderOccurrence) => void;
  onDeleteSeries: (occurrence: ReminderOccurrence) => void;
}

export const ReminderDayPanel = ({
  date,
  occurrences,
  todayKey,
  onAdd,
  onEditOccurrence,
  onEditSeries,
  onDeleteOccurrence,
  onDeleteSeries,
}: ReminderDayPanelProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: updateOccurrence, isPending } =
    useUpdateReminderOccurrence();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOccurrence, setMenuOccurrence] =
    useState<ReminderOccurrence | null>(null);

  const sortedOccurrences = useMemo(
    () =>
      [...occurrences].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "pending" ? -1 : 1;
        }
        return a.title.localeCompare(b.title, "es");
      }),
    [occurrences],
  );

  const handleTogglePaid = async (occurrence: ReminderOccurrence) => {
    try {
      await updateOccurrence({
        reminderId: occurrence.reminderId,
        occurrenceDate: occurrence.occurrenceDate,
        payload: {
          status: occurrence.status === "paid" ? "pending" : "paid",
        },
      });
      showSnackbar(
        occurrence.status === "paid"
          ? "Recordatorio marcado como pendiente"
          : "Pago registrado",
      );
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const openMenu = (
    event: MouseEvent<HTMLElement>,
    occurrence: ReminderOccurrence,
  ) => {
    setMenuAnchor(event.currentTarget);
    setMenuOccurrence(occurrence);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuOccurrence(null);
  };

  const runMenuAction = (action: (occurrence: ReminderOccurrence) => void) => {
    if (menuOccurrence) action(menuOccurrence);
    closeMenu();
  };

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
          }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Agenda del día
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}>
              {formatDate(date, "EEEE d 'de' MMMM")}
            </Typography>
          </Box>
          {occurrences.length > 0 && (
            <Chip
              size="small"
              label={`${occurrences.length} recordatorio${occurrences.length === 1 ? "" : "s"}`}
            />
          )}
        </Stack>

        {sortedOccurrences.length === 0 ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No hay recordatorios para este día.
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
              Agregar recordatorio
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {sortedOccurrences.map((occurrence) => {
              const overdue = isReminderOverdue(occurrence, todayKey);

              return (
                <Paper
                  key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderLeft: 4,
                    borderLeftColor:
                      occurrence.status === "paid"
                        ? "success.main"
                        : overdue
                          ? "error.main"
                          : "warning.main",
                  }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "flex-start" }}>
                    <Tooltip
                      title={
                        occurrence.status === "paid"
                          ? "Marcar como pendiente"
                          : "Marcar como pagado"
                      }>
                      <IconButton
                        size="small"
                        color={
                          occurrence.status === "paid" ? "success" : "default"
                        }
                        aria-label={
                          occurrence.status === "paid"
                            ? `Marcar "${occurrence.title}" como pendiente`
                            : `Marcar "${occurrence.title}" como pagado`
                        }
                        disabled={isPending}
                        onClick={() => void handleTogglePaid(occurrence)}>
                        {occurrence.status === "paid" ? (
                          <CheckCircleIcon />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          wordBreak: "break-word",
                          textDecoration:
                            occurrence.status === "paid"
                              ? "line-through"
                              : "none",
                          color:
                            occurrence.status === "paid"
                              ? "text.secondary"
                              : "text.primary",
                        }}>
                        {occurrence.title}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        useFlexGap
                        sx={{ flexWrap: "wrap", mt: 0.5 }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={formatRecurrence(occurrence.recurrence)}
                        />
                        <Chip
                          size="small"
                          label={
                            occurrence.status === "paid"
                              ? "Pagado"
                              : overdue
                                ? "Vencido"
                                : "Pendiente"
                          }
                          color={
                            occurrence.status === "paid"
                              ? "success"
                              : overdue
                                ? "error"
                                : "warning"
                          }
                        />
                      </Stack>
                    </Box>

                    <IconButton
                      size="small"
                      aria-label={`Acciones de "${occurrence.title}"`}
                      onClick={(event) => openMenu(event, occurrence)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </CardContent>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={() => runMenuAction(onEditOccurrence)}>
          {menuOccurrence?.recurrence
            ? "Editar esta fecha"
            : "Editar recordatorio"}
        </MenuItem>
        {menuOccurrence?.recurrence && (
          <MenuItem onClick={() => runMenuAction(onEditSeries)}>
            Editar toda la serie
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => runMenuAction(onDeleteOccurrence)}>
          {menuOccurrence?.recurrence
            ? "Eliminar esta fecha"
            : "Eliminar recordatorio"}
        </MenuItem>
        {menuOccurrence?.recurrence && (
          <MenuItem onClick={() => runMenuAction(onDeleteSeries)}>
            Eliminar toda la serie
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
