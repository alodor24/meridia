import { describe, expect, it } from "vitest";
import { buildMonthSummaryChartOptions } from "./monthSummaryChartOptions";

const getYTickCallback = (currency: string) => {
  const options = buildMonthSummaryChartOptions(currency);

  return options.scales?.y?.ticks?.callback as
    ((value: number) => string) | undefined;
};

describe("buildMonthSummaryChartOptions", () => {
  it("formatea el eje Y con la moneda del usuario", () => {
    expect(getYTickCallback("USD")?.(1250)).toBe("USD 1.250,00");
  });

  it("usa el código de moneda recibido", () => {
    expect(getYTickCallback("ARS")?.(10)).toBe("ARS 10,00");
  });

  it("mantiene la configuración base del gráfico", () => {
    const options = buildMonthSummaryChartOptions("USD");
    const yScale = options.scales?.y as { beginAtZero?: boolean } | undefined;

    expect(yScale?.beginAtZero).toBe(true);
    expect(options.plugins?.legend?.display).toBe(false);
  });
});
