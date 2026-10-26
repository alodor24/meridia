import type { ChartOptions } from "chart.js";
import { formatCurrency } from "@/utils/format";

export const buildBarOptions = (
  currency: string,
  tooltipTitle?: (index: number) => string,
): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 8,
      right: 8,
      left: 8,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (item) =>
          `${item.dataset.label ?? ""}: ${formatCurrency(item.parsed.y ?? 0, currency)}`,
        ...(tooltipTitle
          ? {
              title: (items) => tooltipTitle(items[0]?.dataIndex ?? 0),
            }
          : {}),
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 6,
        callback: (value) => formatCurrency(Number(value), currency),
      },
    },
  },
});
