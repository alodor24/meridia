import type { ReminderOccurrence } from "@meridia/shared";
import type { SchedulerEvent } from "@mui/x-scheduler/models";
import { today } from "@/utils/format";
import { isReminderOverdue } from "./reminderStatus";

export const PAID_EVENT_CLASS = "reminder-occurrence--paid";

export const schedulerEventId = (
  occurrence: Pick<ReminderOccurrence, "reminderId" | "occurrenceDate">,
) => `${occurrence.reminderId}::${occurrence.occurrenceDate}`;

const eventColor = (
  occurrence: ReminderOccurrence,
  todayKey: string,
): SchedulerEvent["color"] => {
  if (occurrence.status === "paid") return "green";
  if (isReminderOverdue(occurrence, todayKey)) return "red";
  return "amber";
};

export const toSchedulerEvents = (
  occurrences: readonly ReminderOccurrence[],
  todayKey = today(),
): SchedulerEvent[] =>
  occurrences.map((occurrence) => ({
    id: schedulerEventId(occurrence),
    title: occurrence.title,
    start: `${occurrence.date}T00:00:00`,
    end: `${occurrence.date}T00:00:00`,
    allDay: true,
    color: eventColor(occurrence, todayKey),
    readOnly: true,
    className: occurrence.status === "paid" ? PAID_EVENT_CLASS : undefined,
  }));
