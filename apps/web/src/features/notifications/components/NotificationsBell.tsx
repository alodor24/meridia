import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPopover from "./NotificationPopover";
import useNotificationsBell from "../hooks/useNotificationsBell";

const POPOVER_ID = "notifications-popover";

export const NotificationsBell = () => {
  const {
    anchorEl,
    open,
    closePopover,
    reminderNotifications,
    isLoading,
    onOccurrenceClick,
    total,
    ariaLabel,
    setAnchorEl,
    openCalendar,
  } = useNotificationsBell();

  return (
    <>
      <IconButton
        color="inherit"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? POPOVER_ID : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ ml: 1 }}>
        <Badge
          badgeContent={total}
          color="error"
          max={99}
          invisible={total === 0}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationPopover
        id={POPOVER_ID}
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        reminderNotifications={reminderNotifications}
        isLoading={isLoading}
        onOccurrenceClick={onOccurrenceClick}
        openCalendar={openCalendar}
      />
    </>
  );
};

export default NotificationsBell;
