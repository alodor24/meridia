import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReminderOccurrence } from "@meridia/shared";
import { formatDate } from "@/utils/format";
import { formatRecurrence } from "../utils/recurrence";
import { SHADOW } from "@/theme/globalStyles";

export interface ReminderUpcomingProps {
  occurrences: ReminderOccurrence[];
  loading?: boolean;
  onSelect: (occurrence: ReminderOccurrence) => void;
}

export const ReminderUpcoming = ({
  occurrences,
  loading = false,
  onSelect,
}: ReminderUpcomingProps) => {
  const pending = occurrences
    .filter((occurrence) => occurrence.status === "pending")
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, 8);

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent>
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
          <Typography variant="body2" color="text.secondary">
            No hay pagos pendientes en los próximos 30 días.
          </Typography>
        ) : (
          <List disablePadding>
            {pending.map((occurrence) => (
              <ListItemButton
                key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
                onClick={() => onSelect(occurrence)}
                sx={{ px: 0 }}>
                <ListItemText
                  primary={occurrence.title}
                  secondary={formatRecurrence(occurrence.recurrence)}
                  slotProps={{
                    primary: { sx: { fontWeight: 600 } },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, whiteSpace: "nowrap" }}>
                  {formatDate(occurrence.date, "dd MMM")}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
