import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Stack from "@mui/material/Stack";
import { isReminderOverdue } from "../utils/reminderStatus";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatRecurrence } from "../utils/recurrence";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ReminderOccurrence } from "@meridia/shared";
import { SHADOW } from "@/theme/globalStyles";

interface ListReminderDayProps {
  sortedOccurrences: ReminderOccurrence[];
  todayKey: string;
  isPending: boolean;
  handleTogglePaid: (occurrence: ReminderOccurrence) => Promise<void>;
  openMenu: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    occurrence: ReminderOccurrence,
  ) => void;
  menuAnchor: HTMLElement | null;
  closeMenu: () => void;
  runMenuAction: (action: (occurrence: ReminderOccurrence) => void) => void;
  menuOccurrence: ReminderOccurrence | null;
  onEditOccurrence: (occurrence: ReminderOccurrence) => void;
  onEditSeries: (occurrence: ReminderOccurrence) => void;
  onDeleteOccurrence: (occurrence: ReminderOccurrence) => void;
  onDeleteSeries: (occurrence: ReminderOccurrence) => void;
}

const ListReminderDay = ({
  sortedOccurrences,
  todayKey,
  isPending,
  handleTogglePaid,
  openMenu,
  closeMenu,
  menuAnchor,
  menuOccurrence,
  runMenuAction,
  onEditOccurrence,
  onEditSeries,
  onDeleteOccurrence,
  onDeleteSeries,
}: ListReminderDayProps) => {
  return (
    <>
      <Stack spacing={1.5} sx={{ maxHeight: 350, overflowY: "auto" }}>
        {sortedOccurrences.map((occurrence) => {
          const overdue = isReminderOverdue(occurrence, todayKey);

          return (
            <Paper
              key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
              variant="outlined"
              sx={{
                p: 2,
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
                <CustomTooltip
                  title={
                    occurrence.status === "paid"
                      ? "Marcar como pendiente"
                      : "Marcar como pagado"
                  }>
                  <IconButton
                    size="small"
                    color={occurrence.status === "paid" ? "success" : "default"}
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
                </CustomTooltip>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      wordBreak: "break-word",
                      textDecoration:
                        occurrence.status === "paid" ? "line-through" : "none",
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

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              boxShadow: SHADOW,
            },
          },
        }}>
        <Box sx={{ px: 2, py: 1 }}>
          <MenuItem
            sx={{ borderRadius: 1 }}
            onClick={() => runMenuAction(onEditOccurrence)}>
            {menuOccurrence?.recurrence
              ? "Editar esta fecha"
              : "Editar recordatorio"}
          </MenuItem>
          {menuOccurrence?.recurrence && (
            <MenuItem
              sx={{ borderRadius: 1 }}
              onClick={() => runMenuAction(onEditSeries)}>
              Editar toda la serie
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            sx={{ borderRadius: 1 }}
            onClick={() => runMenuAction(onDeleteOccurrence)}>
            {menuOccurrence?.recurrence
              ? "Eliminar esta fecha"
              : "Eliminar recordatorio"}
          </MenuItem>
          {menuOccurrence?.recurrence && (
            <MenuItem
              sx={{ borderRadius: 1 }}
              onClick={() => runMenuAction(onDeleteSeries)}>
              Eliminar toda la serie
            </MenuItem>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default ListReminderDay;
