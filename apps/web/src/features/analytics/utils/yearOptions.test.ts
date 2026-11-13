import { describe, expect, it } from "vitest";
import { buildYearRange } from "./yearOptions";

const NOW = new Date(2026, 10, 13);

describe("buildYearRange", () => {
  it("abarca desde el año de registro hasta el año actual", () => {
    expect(buildYearRange("2024-05-10T12:00:00.000Z", NOW)).toEqual({
      min: 2024,
      max: 2026,
    });
  });

  it("usa el año actual cuando no hay fecha de registro", () => {
    expect(buildYearRange(undefined, NOW)).toEqual({ min: 2026, max: 2026 });
  });

  it("limita el mínimo al año actual si el registro está en el futuro", () => {
    expect(buildYearRange("2028-01-01T12:00:00.000Z", NOW)).toEqual({
      min: 2026,
      max: 2026,
    });
  });

  it("ignora fechas de registro inválidas", () => {
    expect(buildYearRange("fecha-invalida", NOW)).toEqual({
      min: 2026,
      max: 2026,
    });
  });
});
