import { formatNotificationDate } from "@/features/calendar/utils/notifications";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { pluralize } from "../utils/helper";
import { ReminderNotificationsData } from "../types";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import { Link } from "@tanstack/react-router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FreeCancellationIcon from "@mui/icons-material/FreeCancellation";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

interface ReminderNotificationsProps {
  reminderNotifications: ReminderNotificationsData;
  onOccurrenceClick: (occurrenceDate: string) => void;
  openCalendar: () => void;
}

const ReminderNotifications = ({
  reminderNotifications,
  onOccurrenceClick,
  openCalendar,
}: ReminderNotificationsProps) => {
  return (
    <>
      {reminderNotifications.items.length === 0 && (
        <Stack
          direction="column"
          spacing={1.5}
          sx={{ alignItems: "center", py: 2 }}>
          <NotificationsNoneIcon fontSize="large" />
          <Typography variant="body2" color="text.secondary">
            No hay novedades por ahora
          </Typography>
        </Stack>
      )}

      {reminderNotifications.items.length > 0 && (
        <>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", fontWeight: 700 }}>
            Recordatorios próximos
          </Typography>

          <List dense disablePadding sx={{ maxHeight: 220, overflowY: "auto" }}>
            {reminderNotifications.items.map((occurrence) => (
              <ListItemButton
                key={`${occurrence.reminderId}:${occurrence.occurrenceDate}`}
                onClick={() => onOccurrenceClick(occurrence.date)}
                sx={{ alignItems: "center", p: 1.5 }}>
                <Stack direction="row" spacing={1.5}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "background.default",
                    }}>
                    <FreeCancellationIcon color="action" fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {occurrence.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          occurrence.date === reminderNotifications.todayKey
                            ? "warning.main"
                            : "text.secondary",
                        fontWeight:
                          occurrence.date === reminderNotifications.todayKey
                            ? 600
                            : 400,
                      }}>
                      {formatNotificationDate(
                        occurrence.date,
                        reminderNotifications.todayKey,
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </ListItemButton>
            ))}
          </List>

          {reminderNotifications.total > reminderNotifications.items.length && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                px: 2,
                py: 1,
              }}>
              +
              {reminderNotifications.total - reminderNotifications.items.length}{" "}
              {pluralize(
                reminderNotifications.total -
                  reminderNotifications.items.length,
                "recordatorio más",
                "recordatorios más",
              )}
            </Typography>
          )}

          <Divider />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
            }}>
            <MuiLink
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
              component={Link}
              onClick={openCalendar}
              variant="body2"
              underline="none">
              Ver calendario <ChevronRightIcon />
            </MuiLink>
          </Box>
        </>
      )}
    </>
  );
};

export default ReminderNotifications;
