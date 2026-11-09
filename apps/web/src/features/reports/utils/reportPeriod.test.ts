import { describe, expect, it } from "vitest";
import type { ReportSelection } from "../types";
import {
  buildReportFilename,
  buildReportParams,
  buildYearOptions,
  defaultReportSelection,
  isCustomRangeInvalid,
} from "./reportPeriod";

const selection = (patch: Partial<ReportSelection> = {}): ReportSelection => ({
  ...defaultReportSelection(new Date(2026, 9, 26)),
  ...patch,
});

describe("reportPeriod utils", () => {
  it("arma el rango por defecto del mes actual", () => {
    const result = defaultReportSelection(new Date(2026, 9, 26));

    expect(result).toMatchObject({
      period: "monthly",
      year: 2026,
      month: 10,
      from: "2026-10-01",
      to: "2026-10-31",
    });
  });

  it("construye parámetros mensuales, anuales y personalizados", () => {
    expect(buildReportParams(selection())).toEqual({
      period: "monthly",
      year: 2026,
      month: 10,
    });

    expect(
      buildReportParams(selection({ period: "annual", year: 2025 })),
    ).toEqual({ period: "annual", year: 2025 });

    expect(
      buildReportParams(
        selection({
          period: "custom",
          from: "2026-01-01",
          to: "2026-03-31",
          filters: { accountId: "a1", categoryId: "", type: "expense" },
        }),
      ),
    ).toEqual({
      period: "custom",
      from: "2026-01-01",
      to: "2026-03-31",
      accountId: "a1",
      type: "expense",
    });
  });

  it("valida y nombra los reportes", () => {
    expect(
      isCustomRangeInvalid(
        selection({ period: "custom", from: "2026-03-01", to: "2026-02-01" }),
      ),
    ).toBe(true);

    expect(
      buildReportFilename({ period: "monthly", year: 2026, month: 9 }, "pdf"),
    ).toBe("meridia_reporte_mensual_2026-09.pdf");

    expect(buildReportFilename({ period: "annual", year: 2026 }, "csv")).toBe(
      "meridia_reporte_anual_2026.csv",
    );

    expect(
      buildReportFilename(
        {
          period: "custom",
          from: "2026-01-01",
          to: "2026-02-28",
        },
        "csv",
      ),
    ).toBe("meridia_reporte_personalizado_2026-01-01_2026-02-28.csv");
  });

  it("genera años desde la creación del usuario hasta el año actual", () => {
    const years = buildYearOptions("2024-05-10T00:00:00.000Z");
    const currentYear = new Date().getFullYear();

    expect(years[0]).toBe(currentYear);
    expect(years[years.length - 1]).toBe(2024);
  });
});
