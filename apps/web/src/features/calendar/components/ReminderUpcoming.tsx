import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReminderOccurrence } from "@meridia/shared";
import { SHADOW } from "@/theme/globalStyles";
import ListNextPending from "./ListNextPending";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface ReminderUpcomingProps {
  occurrences: ReminderOccurrence[];
  loading?: boolean;
  onSelect: (occurrence: ReminderOccurrence) => void;
}

const ReminderUpcoming = ({
  occurrences,
  loading = false,
  onSelect,
}: ReminderUpcomingProps) => {
  const pending = occurrences
    .filter((occurrence) => occurrence.status === "pending")
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Próximos vencimientos
          </Typography>
          <Typography variant="caption" color="text.secondary">
            30 días
          </Typography>
        </Stack>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando…
          </Typography>
        ) : pending.length === 0 ? (
          <Stack
            direction="column"
            spacing={2}
            sx={{ alignItems: "center", py: 4 }}>
            <ScheduleIcon color="disabled" sx={{ fontSize: 48 }} />
            <Typography variant="body2" color="text.secondary">
              No hay pagos pendientes en los próximos 30 días.
            </Typography>
          </Stack>
        ) : (
          <ListNextPending onSelect={onSelect} pending={pending} />
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderUpcoming;
