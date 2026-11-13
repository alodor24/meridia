import { describe, expect, it } from "vitest";
import type { ReminderOccurrence } from "@meridia/shared";
import { isReminderOverdue } from "./reminderStatus";

const buildOccurrence = (
  overrides: Partial<ReminderOccurrence> = {},
): ReminderOccurrence => ({
  reminderId: "reminder-1" as ReminderOccurrence["reminderId"],
  occurrenceDate: "2026-10-23",
  date: "2026-10-23",
  title: "Alquiler",
  seriesTitle: "Alquiler",
  seriesStartDate: "2026-10-23",
  status: "pending",
  paidAt: null,
  recurrence: null,
  ...overrides,
});

describe("isReminderOverdue", () => {
  it("considera vencida una ocurrencia pendiente anterior a hoy", () => {
    expect(isReminderOverdue(buildOccurrence(), "2026-10-24")).toBe(true);
  });

  it("no considera vencida una ocurrencia pendiente de hoy", () => {
    expect(isReminderOverdue(buildOccurrence(), "2026-10-23")).toBe(false);
  });

  it("no considera vencida una ocurrencia pendiente futura", () => {
    expect(isReminderOverdue(buildOccurrence(), "2026-10-22")).toBe(false);
  });

  it("no considera vencida una ocurrencia pagada aunque sea pasada", () => {
    expect(
      isReminderOverdue(
        buildOccurrence({
          status: "paid",
          paidAt: "2026-10-23T12:00:00.000Z",
        }),
        "2026-10-24",
      ),
    ).toBe(false);
  });
});
