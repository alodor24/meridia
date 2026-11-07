import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import { NotificationListResponse, ReminderNotificationsData } from "../types";
import { UseQueryResult } from "@tanstack/react-query";
import { SHADOW } from "@/theme/globalStyles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReminderNotifications from "./ReminderNotifications";

interface NotificationPopoverProps {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  reminderNotifications: ReminderNotificationsData;
  isLoading: boolean;
  onOccurrenceClick: (occurrenceDate: string) => void;
  notificationsQuery: UseQueryResult<NotificationListResponse, Error>;
  unreadCount: number;
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
  notificationsQuery,
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
        <>
          {notificationsQuery.isError && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 2,
              }}>
              <Typography variant="body2" color="error">
                No se pudieron cargar las notificaciones
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => void notificationsQuery.refetch()}>
                Reintentar
              </Button>
            </Box>
          )}

          {notificationsQuery.isSuccess && (
            <ReminderNotifications
              reminderNotifications={reminderNotifications}
              onOccurrenceClick={onOccurrenceClick}
              openCalendar={openCalendar}
            />
          )}
        </>
      )}
    </Popover>
  );
};

export default NotificationPopover;
