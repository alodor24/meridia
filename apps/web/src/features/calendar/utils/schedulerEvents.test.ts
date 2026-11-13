import { describe, expect, it } from "vitest";
import type { ReminderOccurrence } from "@meridia/shared";
import {
  PAID_EVENT_CLASS,
  schedulerEventId,
  toSchedulerEvents,
} from "./schedulerEvents";

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

describe("toSchedulerEvents", () => {
  it("mapea una ocurrencia pendiente a un evento de día completo", () => {
    expect(toSchedulerEvents([buildOccurrence()], "2026-10-23")).toEqual([
      {
        id: "reminder-1::2026-10-23",
        title: "Alquiler",
        start: "2026-10-23T00:00:00",
        end: "2026-10-23T00:00:00",
        allDay: true,
        color: "amber",
        readOnly: true,
        className: undefined,
      },
    ]);
  });

  it("usa el rojo para las ocurrencias pendientes vencidas", () => {
    expect(toSchedulerEvents([buildOccurrence()], "2026-10-24")).toEqual([
      expect.objectContaining({
        color: "red",
        className: undefined,
      }),
    ]);
  });

  it("marca visualmente las ocurrencias pagadas", () => {
    expect(
      toSchedulerEvents(
        [
          buildOccurrence({
            status: "paid",
            paidAt: "2026-10-23T12:00:00.000Z",
          }),
        ],
        "2026-10-23",
      ),
    ).toEqual([
      expect.objectContaining({
        color: "green",
        className: PAID_EVENT_CLASS,
      }),
    ]);
  });

  it("usa la fecha efectiva de la ocurrencia y conserva un id único", () => {
    const occurrence = buildOccurrence({ date: "2026-10-25" });

    expect(toSchedulerEvents([occurrence], "2026-10-23")).toEqual([
      expect.objectContaining({
        id: schedulerEventId(occurrence),
        start: "2026-10-25T00:00:00",
      }),
    ]);
  });
});
