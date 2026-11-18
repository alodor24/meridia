import { describe, expect, it } from "vitest";
import {
  buildSeriesKeys,
  formatDateEs,
  groupKeyForDate,
  resolveReportPeriod,
} from "./reports.period";

describe("resolveReportPeriod", () => {
  it("genera el rango completo de un mes, incluyendo años bisiestos", () => {
    const period = resolveReportPeriod({
      period: "monthly",
      year: 2024,
      month: 2,
    });

    expect(period).toMatchObject({
      from: "2024-02-01",
      to: "2024-02-29",
      granularity: "day",
      label: "Febrero 2024",
      shortLabel: "2024-02",
    });
    expect(buildSeriesKeys(period)).toHaveLength(29);
  });

  it("genera los 12 meses de un reporte anual", () => {
    const period = resolveReportPeriod({ period: "annual", year: 2026 });

    expect(period).toMatchObject({
      from: "2026-01-01",
      to: "2026-12-31",
      granularity: "month",
      label: "Año 2026",
      shortLabel: "2026",
    });

    const keys = buildSeriesKeys(period);
    expect(keys).toHaveLength(12);
    expect(keys[0]).toMatchObject({ key: "2026-01", shortLabel: "Ene" });
    expect(keys[11]).toMatchObject({ key: "2026-12", shortLabel: "Dic" });
  });

  it("elige la granularidad según la longitud del rango personalizado", () => {
    const short = resolveReportPeriod({
      period: "custom",
      from: "2026-01-01",
      to: "2026-01-31",
    });
    expect(short.granularity).toBe("day");
    expect(buildSeriesKeys(short)).toHaveLength(31);

    const medium = resolveReportPeriod({
      period: "custom",
      from: "2026-01-01",
      to: "2026-04-10",
    });
    expect(medium.granularity).toBe("month");
    expect(buildSeriesKeys(medium)).toHaveLength(4);

    const long = resolveReportPeriod({
      period: "custom",
      from: "2024-01-01",
      to: "2026-12-31",
    });
    expect(long.granularity).toBe("year");
    expect(buildSeriesKeys(long)).toHaveLength(3);
  });

  it("formatea fechas y claves de agrupación", () => {
    expect(formatDateEs("2026-08-10")).toBe("10/08/2026");
    expect(groupKeyForDate("2026-08-10", "day")).toBe("2026-08-10");
    expect(groupKeyForDate("2026-08-10", "month")).toBe("2026-08");
    expect(groupKeyForDate("2026-08-10", "year")).toBe("2026");
  });
});
