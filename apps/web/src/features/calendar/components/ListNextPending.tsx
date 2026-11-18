import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { formatRecurrence } from "../utils/recurrence";
import { formatDate } from "@/utils/format";
import { ReminderOccurrence } from "@meridia/shared";

interface ListNextPendingProps {
  pending: ReminderOccurrence[];
  onSelect: (occurrence: ReminderOccurrence) => void;
}

const ListNextPending = ({ pending, onSelect }: ListNextPendingProps) => {
  return (
    <List disablePadding sx={{ maxHeight: 350, overflowY: "auto" }}>
      {pending.map((occurrence) => (
        <ListItemButton
          key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
          onClick={() => onSelect(occurrence)}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: "warning.main" }}>
              <ScheduleIcon />
            </Avatar>
          </ListItemAvatar>
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
  );
};

export default ListNextPending;
