import { describe, expect, it } from "vitest";
import { buildYearOptions } from "./yearOptions";

describe("buildYearOptions", () => {
  it("genera los años en orden descendente", () => {
    expect(buildYearOptions(2023, 2026)).toEqual([2026, 2025, 2024, 2023]);
  });

  it("devuelve un solo año cuando el rango es igual", () => {
    expect(buildYearOptions(2026, 2026)).toEqual([2026]);
  });

  it("devuelve una lista vacía cuando el rango es inválido", () => {
    expect(buildYearOptions(2026, 2023)).toEqual([]);
  });
});
