import { describe, expect, it } from "vitest";
import type { ReminderRecurrence } from "@meridia/shared";
import { describeRecurrence, formatRecurrence } from "./recurrence";

const recurrence = (
  overrides: Partial<ReminderRecurrence> = {},
): ReminderRecurrence => ({
  unit: "month",
  interval: 1,
  endDate: null,
  ...overrides,
});

describe("formatRecurrence", () => {
  it("identifica recordatorios únicos", () => {
    expect(formatRecurrence(null)).toBe("Única");
  });

  it("formatea intervalos en singular y plural", () => {
    expect(formatRecurrence(recurrence())).toBe("Cada mes");
    expect(formatRecurrence(recurrence({ interval: 2 }))).toBe("Cada 2 meses");
    expect(formatRecurrence(recurrence({ unit: "week", interval: 2 }))).toBe(
      "Cada 2 semanas",
    );
    expect(formatRecurrence(recurrence({ unit: "day" }))).toBe("Cada día");
  });

  it("incluye la fecha de fin", () => {
    expect(
      formatRecurrence(recurrence({ endDate: "2026-12-31" })),
    ).toBe("Cada mes · hasta 31/12/2026");
  });
});

describe("describeRecurrence", () => {
  it("describe un recordatorio único", () => {
    expect(describeRecurrence("2026-10-23", null)).toBe(
      "Se registrará una sola fecha.",
    );
  });

  it("describe una recurrencia con y sin fin", () => {
    expect(describeRecurrence("2026-10-23", recurrence())).toBe(
      "Se repetirá cada mes desde el 23/10/2026.",
    );
    expect(
      describeRecurrence(
        "2026-10-23",
        recurrence({ interval: 2, endDate: "2026-12-23" }),
      ),
    ).toBe(
      "Se repetirá cada 2 meses desde el 23/10/2026 hasta el 23/12/2026.",
    );
  });
});
