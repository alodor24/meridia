import { ValidationError } from "../../shared/errors";

export type ReportPeriodKind = "monthly" | "annual" | "custom";
export type ReportGranularity = "day" | "month" | "year";

export interface ReportPeriodInput {
  period: ReportPeriodKind;
  year?: number;
  month?: number;
  from?: string;
  to?: string;
}

export interface SeriesKey {
  key: string;
  label: string;
  shortLabel: string;
}

export interface ResolvedPeriod {
  kind: ReportPeriodKind;
  from: string;
  to: string;
  granularity: ReportGranularity;
  label: string;
  shortLabel: string;
}

export const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export const MONTH_SHORT_NAMES_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

const MS_PER_DAY = 86_400_000;

const pad2 = (value: number): string => String(value).padStart(2, "0");

const toUtcDate = (isoDate: string): Date =>
  new Date(`${isoDate}T00:00:00.000Z`);

export const toIsoDate = (date: Date): string =>
  date.toISOString().slice(0, 10);

const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

export const daysBetweenInclusive = (from: string, to: string): number =>
  Math.round(
    (toUtcDate(to).getTime() - toUtcDate(from).getTime()) / MS_PER_DAY,
  ) + 1;

export const formatDateEs = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export const formatDateTimeEs = (isoDateTime: string): string =>
  dateTimeFormatter.format(new Date(isoDateTime));

const monthYearLabel = (year: number, month: number): string =>
  `${MONTH_NAMES_ES[month - 1]} ${year}`;

export const resolveReportPeriod = (
  input: ReportPeriodInput,
): ResolvedPeriod => {
  if (input.period === "monthly") {
    if (input.year === undefined || input.month === undefined) {
      throw new ValidationError("El año y el mes son requeridos");
    }

    const from = `${input.year}-${pad2(input.month)}-01`;
    const to = `${input.year}-${pad2(input.month)}-${pad2(daysInMonth(input.year, input.month))}`;

    return {
      kind: "monthly",
      from,
      to,
      granularity: "day",
      label: monthYearLabel(input.year, input.month),
      shortLabel: `${input.year}-${pad2(input.month)}`,
    };
  }

  if (input.period === "annual") {
    if (input.year === undefined) {
      throw new ValidationError("El año es requerido");
    }

    return {
      kind: "annual",
      from: `${input.year}-01-01`,
      to: `${input.year}-12-31`,
      granularity: "month",
      label: `Año ${input.year}`,
      shortLabel: String(input.year),
    };
  }

  if (!input.from || !input.to) {
    throw new ValidationError("Las fechas desde y hasta son requeridas");
  }
  if (input.from > input.to) {
    throw new ValidationError(
      "La fecha hasta debe ser mayor o igual a la fecha desde",
    );
  }

  const days = daysBetweenInclusive(input.from, input.to);
  const granularity: ReportGranularity =
    days <= 62 ? "day" : days <= 730 ? "month" : "year";

  return {
    kind: "custom",
    from: input.from,
    to: input.to,
    granularity,
    label: `Del ${formatDateEs(input.from)} al ${formatDateEs(input.to)}`,
    shortLabel: `${input.from}_${input.to}`,
  };
};

export const buildSeriesKeys = (period: ResolvedPeriod): SeriesKey[] => {
  const keys: SeriesKey[] = [];

  if (period.granularity === "day") {
    const end = toUtcDate(period.to).getTime();
    let current = toUtcDate(period.from);

    while (current.getTime() <= end) {
      const isoDate = toIsoDate(current);
      const month = current.getUTCMonth() + 1;
      keys.push({
        key: isoDate,
        label: `${current.getUTCDate()} ${MONTH_SHORT_NAMES_ES[month - 1]}`,
        shortLabel: String(current.getUTCDate()),
      });
      current = new Date(current.getTime() + MS_PER_DAY);
    }

    return keys;
  }

  if (period.granularity === "month") {
    const startYear = Number(period.from.slice(0, 4));
    const startMonth = Number(period.from.slice(5, 7));
    const endYear = Number(period.to.slice(0, 4));
    const endMonth = Number(period.to.slice(5, 7));
    const spansMultipleYears = startYear !== endYear;
    let year = startYear;
    let month = startMonth;

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const shortName = MONTH_SHORT_NAMES_ES[month - 1] ?? String(month);
      keys.push({
        key: `${year}-${pad2(month)}`,
        label: monthYearLabel(year, month),
        shortLabel: spansMultipleYears
          ? `${shortName} ${String(year).slice(2)}`
          : shortName,
      });

      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    return keys;
  }

  const startYear = Number(period.from.slice(0, 4));
  const endYear = Number(period.to.slice(0, 4));

  for (let year = startYear; year <= endYear; year += 1) {
    keys.push({
      key: String(year),
      label: String(year),
      shortLabel: String(year),
    });
  }

  return keys;
};

export const groupKeyForDate = (
  isoDate: string,
  granularity: ReportGranularity,
): string => {
  if (granularity === "day") return isoDate.slice(0, 10);
  if (granularity === "month") return isoDate.slice(0, 7);
  return isoDate.slice(0, 4);
};

export const reportKindLabel = (kind: ReportPeriodKind): string => {
  if (kind === "monthly") return "mensual";
  if (kind === "annual") return "anual";
  return "personalizado";
};
