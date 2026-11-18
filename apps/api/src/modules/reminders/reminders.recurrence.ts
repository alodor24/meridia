import type { ReminderRecurrenceUnit } from '@meridia/shared';

export interface ReminderSchedule {
  startDate: string;
  recurrenceUnit: ReminderRecurrenceUnit | null;
  recurrenceInterval: number | null;
  recurrenceEndDate: string | null;
}

interface IsoDateParts {
  year: number;
  month: number;
  day: number;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;
const MAX_OCCURRENCES_PER_SERIES = 5_000;
const MAX_EXPANSION_STEPS = 100_000;

const pad = (value: number): string => String(value).padStart(2, '0');

const formatIsoDate = (year: number, month: number, day: number): string =>
  `${pad(year)}-${pad(month)}-${pad(day)}`;

export const parseIsoDate = (value: string): IsoDateParts => {
  const [year, month, day] = value.split('-');
  return { year: Number(year), month: Number(month), day: Number(day) };
};

const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

export const isIsoDate = (value: string): boolean => {
  if (!ISO_DATE_RE.test(value)) return false;
  const { year, month, day } = parseIsoDate(value);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
};

const toUtcMs = (parts: IsoDateParts): number =>
  Date.UTC(parts.year, parts.month - 1, parts.day);

const isoToUtcMs = (value: string): number => toUtcMs(parseIsoDate(value));

const utcMsToIso = (value: number): string =>
  new Date(value).toISOString().slice(0, 10);

const addMonthsClamped = (start: IsoDateParts, monthsToAdd: number): string => {
  const totalMonths = start.year * 12 + (start.month - 1) + monthsToAdd;
  const year = Math.floor(totalMonths / 12);
  const monthIndex = ((totalMonths % 12) + 12) % 12;
  const month = monthIndex + 1;
  const day = Math.min(start.day, daysInMonth(year, month));
  return formatIsoDate(year, month, day);
};

export const isoDateRangeInDays = (from: string, to: string): number =>
  Math.round((isoToUtcMs(to) - isoToUtcMs(from)) / MS_PER_DAY) + 1;

const occurrenceAt = (
  start: IsoDateParts,
  unit: ReminderRecurrenceUnit,
  interval: number,
  index: number,
): string => {
  if (unit === 'day') {
    return utcMsToIso(toUtcMs(start) + index * interval * MS_PER_DAY);
  }
  if (unit === 'week') {
    return utcMsToIso(toUtcMs(start) + index * interval * 7 * MS_PER_DAY);
  }
  if (unit === 'month') {
    return addMonthsClamped(start, index * interval);
  }
  return addMonthsClamped(start, index * interval * 12);
};

const estimateStartIndex = (
  start: IsoDateParts,
  from: string,
  unit: ReminderRecurrenceUnit,
  interval: number,
): number => {
  if (unit === 'day') {
    return Math.max(
      0,
      Math.floor((isoToUtcMs(from) - toUtcMs(start)) / (MS_PER_DAY * interval)),
    );
  }
  if (unit === 'week') {
    return Math.max(
      0,
      Math.floor(
        (isoToUtcMs(from) - toUtcMs(start)) / (MS_PER_DAY * 7 * interval),
      ),
    );
  }

  const fromParts = parseIsoDate(from);
  if (unit === 'month') {
    const months =
      (fromParts.year - start.year) * 12 + (fromParts.month - start.month);
    return Math.max(0, Math.floor(months / interval));
  }

  return Math.max(0, Math.floor((fromParts.year - start.year) / interval));
};

export const expandOccurrences = (
  schedule: ReminderSchedule,
  from: string,
  to: string,
): string[] => {
  if (!isIsoDate(from) || !isIsoDate(to) || from > to) return [];

  const unit = schedule.recurrenceUnit;
  const interval = schedule.recurrenceInterval;

  if (!unit || !interval || interval < 1) {
    const { startDate, recurrenceEndDate } = schedule;
    if (startDate < from || startDate > to) return [];
    if (recurrenceEndDate && startDate > recurrenceEndDate) return [];
    return [startDate];
  }

  if (schedule.startDate > to) return [];
  if (schedule.recurrenceEndDate && schedule.recurrenceEndDate < from) return [];

  const effectiveTo =
    schedule.recurrenceEndDate && schedule.recurrenceEndDate < to
      ? schedule.recurrenceEndDate
      : to;
  const start = parseIsoDate(schedule.startDate);

  let index = estimateStartIndex(start, from, unit, interval);
  let occurrence = occurrenceAt(start, unit, interval, index);
  let steps = 0;

  while (occurrence < from) {
    index += 1;
    occurrence = occurrenceAt(start, unit, interval, index);
    steps += 1;
    if (steps > MAX_EXPANSION_STEPS) return [];
  }

  const occurrences: string[] = [];
  while (occurrence <= effectiveTo) {
    occurrences.push(occurrence);
    if (occurrences.length > MAX_OCCURRENCES_PER_SERIES) {
      throw new Error('La serie genera demasiadas ocurrencias');
    }
    index += 1;
    occurrence = occurrenceAt(start, unit, interval, index);
  }

  return occurrences;
};

export const isOccurrenceDate = (
  schedule: ReminderSchedule,
  date: string,
): boolean => {
  if (!isIsoDate(date)) return false;
  if (date < schedule.startDate) return false;
  if (schedule.recurrenceEndDate && date > schedule.recurrenceEndDate) {
    return false;
  }

  if (!schedule.recurrenceUnit || !schedule.recurrenceInterval) {
    return date === schedule.startDate;
  }

  return expandOccurrences(schedule, date, date).includes(date);
};
