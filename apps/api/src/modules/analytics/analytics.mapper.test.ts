import { describe, expect, it } from "vitest";
import {
  buildAvailableYears,
  buildMonthlySeries,
  buildQuarterlySeries,
  buildTotals,
} from "./analytics.mapper";

describe("analytics mapper", () => {
  it("completa los doce meses y calcula el balance", () => {
    const monthly = buildMonthlySeries([
      { month: 1, income: 1000, expenses: 400 },
      { month: 11, income: 0, expenses: 200 },
    ]);

    expect(monthly).toHaveLength(12);
    expect(monthly[0]).toEqual({
      month: 1,
      income: 1000,
      expenses: 400,
      balance: 600,
    });
    expect(monthly[10]).toEqual({
      month: 11,
      income: 0,
      expenses: 200,
      balance: -200,
    });
    expect(monthly[11]).toEqual({
      month: 12,
      income: 0,
      expenses: 0,
      balance: 0,
    });
  });

  it("agrupa los meses en cuatro trimestres", () => {
    const monthly = buildMonthlySeries([
      { month: 1, income: 1000, expenses: 400 },
      { month: 4, income: 500, expenses: 100 },
      { month: 11, income: 0, expenses: 200 },
    ]);
    const quarterly = buildQuarterlySeries(monthly);

    expect(quarterly).toHaveLength(4);
    expect(quarterly[0]).toEqual({
      quarter: 1,
      income: 1000,
      expenses: 400,
      balance: 600,
    });
    expect(quarterly[1]).toEqual({
      quarter: 2,
      income: 500,
      expenses: 100,
      balance: 400,
    });
    expect(quarterly[2]).toEqual({
      quarter: 3,
      income: 0,
      expenses: 0,
      balance: 0,
    });
    expect(quarterly[3]).toEqual({
      quarter: 4,
      income: 0,
      expenses: 200,
      balance: -200,
    });
  });

  it("calcula los totales anuales", () => {
    const monthly = buildMonthlySeries([
      { month: 1, income: 1000, expenses: 400 },
      { month: 4, income: 500, expenses: 100 },
    ]);

    expect(buildTotals(monthly)).toEqual({
      totalIncome: 1500,
      totalExpenses: 500,
      balance: 1000,
    });
  });

  it("incluye el año actual dentro del rango disponible", () => {
    expect(
      buildAvailableYears({ min_year: 2025, max_year: 2026 }, 2027),
    ).toEqual({ min: 2025, max: 2027 });
  });

  it("usa el año actual cuando no hay movimientos", () => {
    expect(
      buildAvailableYears({ min_year: null, max_year: null }, 2026),
    ).toEqual({ min: 2026, max: 2026 });
  });
});
