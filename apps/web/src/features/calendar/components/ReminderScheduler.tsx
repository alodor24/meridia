import { useMemo } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { EventCalendar } from "@mui/x-scheduler/event-calendar";
import { esES } from "@mui/x-scheduler/locales";
import { format } from "date-fns";
import type { ReminderOccurrence } from "@meridia/shared";
import type { SchedulerView } from "../types";
import { SCHEDULER_VIEWS } from "../types";
import {
  PAID_EVENT_CLASS,
  schedulerEventId,
  toSchedulerEvents,
} from "../utils/schedulerEvents";
import { esCapitalized } from "@/utils/esCapitalized";

const localeText = {
  ...esES.components.MuiEventCalendar.defaultProps.localeText,
  calendarContentAriaLabel: "Calendario de recordatorios",
};

interface ReminderSchedulerProps {
  occurrences: ReminderOccurrence[];
  view: SchedulerView;
  visibleDate: Date;
  todayKey: string;
  loading?: boolean;
  onViewChange: (view: SchedulerView) => void;
  onVisibleDateChange: (date: Date) => void;
  onOccurrenceClick: (occurrence: ReminderOccurrence) => void;
  onCreateAt: (date: string) => void;
}

const ReminderScheduler = ({
  occurrences,
  view,
  visibleDate,
  todayKey,
  loading = false,
  onViewChange,
  onVisibleDateChange,
  onOccurrenceClick,
  onCreateAt,
}: ReminderSchedulerProps) => {
  const events = useMemo(
    () => toSchedulerEvents(occurrences, todayKey),
    [occurrences, todayKey],
  );
  const occurrencesById = useMemo(
    () =>
      new Map(
        occurrences.map((occurrence) => [
          schedulerEventId(occurrence),
          occurrence,
        ]),
      ),
    [occurrences],
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 540, md: 620 },
        "& .MuiEventCalendar-headerToolbarSidePanelToggle": {
          display: "none",
        },
        "& .reminder-occurrence--paid .MuiEventCalendar-dayGridEventTitle, & .reminder-occurrence--paid .MuiEventCalendar-eventItemTitle, & .reminder-occurrence--paid .MuiEventCalendar-timeGridEventTitle":
          {
            textDecoration: "line-through",
            opacity: 0.7,
          },
      }}>
      {loading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
          }}
        />
      )}

      <EventCalendar
        events={events}
        view={view}
        views={[...SCHEDULER_VIEWS]}
        visibleDate={visibleDate}
        dateLocale={esCapitalized}
        localeText={localeText}
        defaultView="month"
        defaultPreferences={{
          isSidePanelOpen: false,
          showWeekends: true,
          showWeekNumber: false,
          showEmptyDaysInAgenda: true,
          ampm: false,
        }}
        preferencesMenuConfig={false}
        showCurrentTimeIndicator={false}
        areEventsDraggable={false}
        areEventsResizable={false}
        eventCreation={{ interaction: "click" }}
        onViewChange={(nextView) => {
          if (nextView !== "day") onViewChange(nextView);
        }}
        onVisibleDateChange={(nextDate) => onVisibleDateChange(nextDate)}
        onEventEditingStart={(occurrence, details) => {
          details.cancel();

          if (details.reason === "creation") {
            onCreateAt(
              format(
                details.occurrence.displayTimezone.start.value,
                "yyyy-MM-dd",
              ),
            );
            return;
          }

          const selected = occurrencesById.get(String(occurrence.id));
          if (selected) onOccurrenceClick(selected);
        }}
        sx={{
          [`& .${PAID_EVENT_CLASS}`]: {
            opacity: 0.85,
          },
        }}
      />
    </Box>
  );
};

export default ReminderScheduler;
