import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import type { ReminderOccurrence } from "@meridia/shared";
import { formatDate } from "@/utils/format";
import { SHADOW } from "@/theme/globalStyles";
import TodayIcon from "@mui/icons-material/Today";
import ListReminderDay from "./ListReminderDay";
import useReminderDay from "../hooks/useReminderDay";

interface ReminderDayPanelProps {
  date: Date;
  occurrences: ReminderOccurrence[];
  todayKey: string;
  onAdd: () => void;
  onEditOccurrence: (occurrence: ReminderOccurrence) => void;
  onEditSeries: (occurrence: ReminderOccurrence) => void;
  onDeleteOccurrence: (occurrence: ReminderOccurrence) => void;
  onDeleteSeries: (occurrence: ReminderOccurrence) => void;
}

const ReminderDayPanel = ({
  date,
  occurrences,
  todayKey,
  onAdd,
  onEditOccurrence,
  onEditSeries,
  onDeleteOccurrence,
  onDeleteSeries,
}: ReminderDayPanelProps) => {
  const {
    sortedOccurrences,
    isPending,
    handleTogglePaid,
    openMenu,
    menuAnchor,
    closeMenu,
    runMenuAction,
    menuOccurrence,
  } = useReminderDay({ occurrences });

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 3 }}>
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
            <Typography variant="body2" color="text.secondary">
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
            <TodayIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No hay recordatorios para este día.
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
              Agregar recordatorio
            </Button>
          </Box>
        ) : (
          <ListReminderDay
            sortedOccurrences={sortedOccurrences}
            todayKey={todayKey}
            isPending={isPending}
            handleTogglePaid={handleTogglePaid}
            openMenu={openMenu}
            closeMenu={closeMenu}
            menuAnchor={menuAnchor}
            menuOccurrence={menuOccurrence}
            runMenuAction={runMenuAction}
            onEditOccurrence={onEditOccurrence}
            onEditSeries={onEditSeries}
            onDeleteOccurrence={onDeleteOccurrence}
            onDeleteSeries={onDeleteSeries}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderDayPanel;
