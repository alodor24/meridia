import { describe, expect, it } from "vitest";
import type { AnalyticsQuarterlyTotal } from "@meridia/shared";
import { buildQuarterlyChartData } from "./quarterlyChartData";

const quarterly: AnalyticsQuarterlyTotal[] = [
  { quarter: 1, income: 1000, expenses: 400, balance: 600 },
  { quarter: 2, income: 500, expenses: 100, balance: 400 },
  { quarter: 3, income: 0, expenses: 0, balance: 0 },
  { quarter: 4, income: 0, expenses: 200, balance: -200 },
];

const colors = {
  income: "#4caf50",
  expenses: "#e53935",
  balance: "#0050de",
};

describe("buildQuarterlyChartData", () => {
  it("usa las etiquetas de los cuatro trimestres", () => {
    const chartData = buildQuarterlyChartData(quarterly, colors);

    expect(chartData.labels).toEqual(["T1", "T2", "T3", "T4"]);
  });

  it("separa ingresos y gastos en datasets", () => {
    const chartData = buildQuarterlyChartData(quarterly, colors);

    expect(chartData.datasets[0]?.data).toEqual([1000, 500, 0, 0]);
    expect(chartData.datasets[1]?.data).toEqual([400, 100, 0, 200]);
  });

  it("incluye el balance trimestral como dataset", () => {
    const chartData = buildQuarterlyChartData(quarterly, colors);

    expect(chartData.datasets[2]?.label).toBe("Balance");
    expect(chartData.datasets[2]?.data).toEqual([600, 400, 0, -200]);
    expect(chartData.datasets[2]?.backgroundColor).toBe(colors.balance);
  });
});
