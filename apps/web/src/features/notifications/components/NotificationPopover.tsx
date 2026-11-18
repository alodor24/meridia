import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import { ReminderNotificationsData } from "../types";
import { SHADOW } from "@/theme/globalStyles";
import ReminderNotifications from "./ReminderNotifications";

interface NotificationPopoverProps {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  reminderNotifications: ReminderNotificationsData;
  isLoading: boolean;
  onOccurrenceClick: (occurrenceDate: string) => void;
  openCalendar: () => void;
}

const NotificationPopover = ({
  id,
  open,
  anchorEl,
  onClose,
  reminderNotifications,
  isLoading,
  onOccurrenceClick,
  openCalendar,
}: NotificationPopoverProps) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            mt: 1,
            p: 2,
            boxShadow: SHADOW,
          },
        },
      }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <ReminderNotifications
          reminderNotifications={reminderNotifications}
          onOccurrenceClick={onOccurrenceClick}
          openCalendar={openCalendar}
        />
      )}
    </Popover>
  );
};

export default NotificationPopover;
