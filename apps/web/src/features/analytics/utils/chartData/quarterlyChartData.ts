import type { ChartData } from "chart.js";
import type { AnalyticsQuarterlyTotal } from "@meridia/shared";

interface QuarterlyChartColors {
  income: string;
  expenses: string;
}

export const buildQuarterlyChartData = (
  items: AnalyticsQuarterlyTotal[],
  colors: QuarterlyChartColors,
): ChartData<"bar"> => ({
  labels: items.map((item) => `T${item.quarter}`),
  datasets: [
    {
      label: "Ingresos",
      data: items.map((item) => item.income),
      backgroundColor: colors.income,
      borderRadius: 4,
      maxBarThickness: 56,
    },
    {
      label: "Gastos",
      data: items.map((item) => item.expenses),
      backgroundColor: colors.expenses,
      borderRadius: 4,
      maxBarThickness: 56,
    },
  ],
});
