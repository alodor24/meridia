import type { TransactionType } from "@meridia/shared";

export type ReportFormat = "pdf" | "csv";
export type ReportPeriodKind = "monthly" | "annual" | "custom";

export interface ReportFilters {
  accountId: string;
  categoryId: string;
  type: "" | TransactionType;
}

export interface ReportSelection {
  period: ReportPeriodKind;
  year: number;
  month: number;
  from: string;
  to: string;
  filters: ReportFilters;
}

export interface ReportParams {
  period: ReportPeriodKind;
  year?: number;
  month?: number;
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}
