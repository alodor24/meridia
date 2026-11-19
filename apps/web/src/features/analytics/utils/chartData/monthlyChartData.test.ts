import { describe, expect, it } from "vitest";
import type { AnalyticsMonthlyTotal } from "@meridia/shared";
import { MONTH_LABELS, buildMonthlyChartData } from "./monthlyChartData";

const monthly: AnalyticsMonthlyTotal[] = Array.from(
  { length: 12 },
  (_, index) => ({
    month: index + 1,
    income: (index + 1) * 100,
    expenses: (index + 1) * 50,
    balance: (index + 1) * 50,
  }),
);

const colors = {
  income: "#4caf50",
  expenses: "#e53935",
  balance: "#0050de",
};

describe("buildMonthlyChartData", () => {
  it("usa las etiquetas de los doce meses", () => {
    const chartData = buildMonthlyChartData(monthly, colors);

    expect(chartData.labels).toEqual(MONTH_LABELS);
  });

  it("separa ingresos y gastos en datasets", () => {
    const chartData = buildMonthlyChartData(monthly, colors);

    expect(chartData.datasets[0]?.label).toBe("Ingresos");
    expect(chartData.datasets[0]?.data).toEqual(
      monthly.map((item) => item.income),
    );
    expect(chartData.datasets[1]?.label).toBe("Gastos");
    expect(chartData.datasets[1]?.data).toEqual(
      monthly.map((item) => item.expenses),
    );
  });

  it("incluye el balance mensual como dataset", () => {
    const chartData = buildMonthlyChartData(monthly, colors);

    expect(chartData.datasets[2]?.label).toBe("Balance");
    expect(chartData.datasets[2]?.data).toEqual(
      monthly.map((item) => item.balance),
    );
    expect(chartData.datasets[2]?.backgroundColor).toBe(colors.balance);
  });
});
