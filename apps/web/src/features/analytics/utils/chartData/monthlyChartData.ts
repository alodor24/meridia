import type { ChartData } from "chart.js";
import type { AnalyticsMonthlyTotal } from "@meridia/shared";

export const MONTH_LABELS = [
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
];

interface MonthlyChartColors {
  income: string;
  expenses: string;
  balance: string;
}

export const buildMonthlyChartData = (
  items: AnalyticsMonthlyTotal[],
  colors: MonthlyChartColors,
): ChartData<"bar"> => ({
  labels: items.map(
    (item) => MONTH_LABELS[item.month - 1] ?? String(item.month),
  ),
  datasets: [
    {
      label: "Ingresos",
      data: items.map((item) => item.income),
      backgroundColor: colors.income,
      borderRadius: 4,
      maxBarThickness: 24,
    },
    {
      label: "Gastos",
      data: items.map((item) => item.expenses),
      backgroundColor: colors.expenses,
      borderRadius: 4,
      maxBarThickness: 24,
    },
    {
      label: "Balance",
      data: items.map((item) => item.balance),
      backgroundColor: colors.balance,
      borderRadius: 4,
      maxBarThickness: 24,
    },
  ],
});
