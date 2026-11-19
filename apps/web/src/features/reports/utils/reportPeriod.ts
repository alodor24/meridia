import { endOfMonth, format, startOfMonth } from "date-fns";
import type { ReportFormat, ReportParams, ReportSelection } from "../types";
import { esCapitalized } from "@/utils/esCapitalized";

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: capitalize(
    format(new Date(2026, index, 1), "LLLL", { locale: esCapitalized }),
  ),
}));

export const defaultReportSelection = (now = new Date()): ReportSelection => ({
  period: "monthly",
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  from: format(startOfMonth(now), "yyyy-MM-dd"),
  to: format(endOfMonth(now), "yyyy-MM-dd"),
  filters: {
    accountId: "",
    categoryId: "",
    type: "",
  },
});

export const buildReportParams = (selection: ReportSelection): ReportParams => {
  const params: ReportParams = {
    period: selection.period,
  };

  if (selection.period === "monthly") {
    params.year = selection.year;
    params.month = selection.month;
  } else if (selection.period === "annual") {
    params.year = selection.year;
  } else {
    params.from = selection.from;
    params.to = selection.to;
  }

  if (selection.filters.accountId) {
    params.accountId = selection.filters.accountId;
  }
  if (selection.filters.categoryId) {
    params.categoryId = selection.filters.categoryId;
  }
  if (selection.filters.type) {
    params.type = selection.filters.type;
  }

  return params;
};

export const isCustomRangeInvalid = (selection: ReportSelection): boolean =>
  selection.period === "custom" &&
  (!selection.from || !selection.to || selection.from > selection.to);

export const buildReportFilename = (
  params: ReportParams,
  format: ReportFormat,
): string => {
  if (params.period === "monthly") {
    return `meridia_reporte_mensual_${params.year}-${String(params.month).padStart(2, "0")}.${format}`;
  }

  if (params.period === "annual") {
    return `meridia_reporte_anual_${params.year}.${format}`;
  }

  return `meridia_reporte_personalizado_${params.from}_${params.to}.${format}`;
};

export const buildYearOptions = (createdAt?: string): number[] => {
  const currentYear = new Date().getFullYear();
  const createdYear = createdAt
    ? new Date(createdAt).getFullYear()
    : currentYear - 5;
  const firstYear = Math.min(createdYear, currentYear);
  const years: number[] = [];

  for (let year = currentYear; year >= firstYear; year -= 1) {
    years.push(year);
  }

  return years;
};
