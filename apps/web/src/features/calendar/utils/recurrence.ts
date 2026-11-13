import type {
  ReminderRecurrence,
  ReminderRecurrenceUnit,
} from "@meridia/shared";
import { formatDate } from "@/utils/format";

const UNIT_SINGULAR: Record<ReminderRecurrenceUnit, string> = {
  day: "día",
  week: "semana",
  month: "mes",
  year: "año",
};

const UNIT_PLURAL: Record<ReminderRecurrenceUnit, string> = {
  day: "días",
  week: "semanas",
  month: "meses",
  year: "años",
};

export const RECURRENCE_UNIT_OPTIONS = [
  { value: "day", label: "Día" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
  { value: "year", label: "Año" },
] as const;

const recurrenceBase = (recurrence: ReminderRecurrence): string => {
  const unitLabel =
    recurrence.interval === 1
      ? UNIT_SINGULAR[recurrence.unit]
      : UNIT_PLURAL[recurrence.unit];

  return recurrence.interval === 1
    ? `Cada ${unitLabel}`
    : `Cada ${recurrence.interval} ${unitLabel}`;
};

export const formatRecurrence = (
  recurrence: ReminderRecurrence | null,
): string => {
  if (!recurrence) return "Única";

  const base = recurrenceBase(recurrence);
  return recurrence.endDate
    ? `${base} · hasta ${formatDate(recurrence.endDate)}`
    : base;
};

export const describeRecurrence = (
  startDate: string,
  recurrence: ReminderRecurrence | null,
): string => {
  if (!recurrence) return "Se registrará una sola fecha.";

  const base =
    recurrence.interval === 1
      ? `Se repetirá cada ${UNIT_SINGULAR[recurrence.unit]}`
      : `Se repetirá cada ${recurrence.interval} ${UNIT_PLURAL[recurrence.unit]}`;

  return recurrence.endDate
    ? `${base} desde el ${formatDate(startDate)} hasta el ${formatDate(recurrence.endDate)}.`
    : `${base} desde el ${formatDate(startDate)}.`;
};
