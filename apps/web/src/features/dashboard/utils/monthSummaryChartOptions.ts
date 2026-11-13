import type { ChartOptions } from "chart.js";
import { LINE_OPTIONS } from "@/consts";
import { formatCurrency } from "@/utils/format";

export const buildMonthSummaryChartOptions = (
  currency: string,
): ChartOptions<"line"> => ({
  ...LINE_OPTIONS,
  scales: {
    ...LINE_OPTIONS.scales,
    y: {
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 6,
        callback: (value) => formatCurrency(Number(value), currency),
      },
    },
  },
});
