import { describe, expect, it } from "vitest";
import type { ReminderOccurrence } from "@meridia/shared";
import {
  formatNotificationDate,
  selectReminderNotifications,
} from "./notifications";

const buildOccurrence = (
  overrides: Partial<ReminderOccurrence> = {},
): ReminderOccurrence => ({
  reminderId: "reminder-1" as ReminderOccurrence["reminderId"],
  occurrenceDate: "2026-10-28",
  date: "2026-10-28",
  title: "Alquiler",
  seriesTitle: "Alquiler",
  seriesStartDate: "2026-10-28",
  status: "pending",
  paidAt: null,
  recurrence: null,
  ...overrides,
});

describe("selectReminderNotifications", () => {
  it("incluye solo pendientes entre hoy y los próximos 3 días", () => {
    const summary = selectReminderNotifications(
      [
        buildOccurrence({
          reminderId: "hoy" as ReminderOccurrence["reminderId"],
        }),
        buildOccurrence({
          reminderId: "manana" as ReminderOccurrence["reminderId"],
          occurrenceDate: "2026-10-29",
          date: "2026-10-29",
          title: "Luz",
        }),
        buildOccurrence({
          reminderId: "limite" as ReminderOccurrence["reminderId"],
          occurrenceDate: "2026-10-31",
          date: "2026-10-31",
          title: "Internet",
        }),
        buildOccurrence({
          reminderId: "fuera" as ReminderOccurrence["reminderId"],
          occurrenceDate: "2026-11-01",
          date: "2026-11-01",
          title: "Seguro",
        }),
        buildOccurrence({
          reminderId: "vencido" as ReminderOccurrence["reminderId"],
          occurrenceDate: "2026-10-27",
          date: "2026-10-27",
          title: "Tarjeta",
        }),
        buildOccurrence({
          reminderId: "pagado" as ReminderOccurrence["reminderId"],
          occurrenceDate: "2026-10-30",
          date: "2026-10-30",
          title: "Agua",
          status: "paid",
          paidAt: "2026-10-28T12:00:00.000Z",
        }),
      ],
      { todayKey: "2026-10-28" },
    );

    expect(summary.items.map((occurrence) => occurrence.title)).toEqual([
      "Alquiler",
      "Luz",
      "Internet",
    ]);
    expect(summary.total).toBe(3);
    expect(summary.todayCount).toBe(1);
    expect(summary.upcomingCount).toBe(2);
  });

  it("ordena por fecha y luego por título", () => {
    const summary = selectReminderNotifications(
      [
        buildOccurrence({ title: "Zapatería" }),
        buildOccurrence({
          reminderId: "b" as ReminderOccurrence["reminderId"],
          title: "Banco",
        }),
        buildOccurrence({
          reminderId: "c" as ReminderOccurrence["reminderId"],
          title: "Alquiler",
          occurrenceDate: "2026-10-29",
          date: "2026-10-29",
        }),
      ],
      { todayKey: "2026-10-28" },
    );

    expect(summary.items.map((occurrence) => occurrence.title)).toEqual([
      "Banco",
      "Zapatería",
      "Alquiler",
    ]);
  });

  it("limita la lista visible sin afectar el total", () => {
    const occurrences = Array.from({ length: 10 }, (_, index) =>
      buildOccurrence({
        reminderId: `reminder-${index}` as ReminderOccurrence["reminderId"],
        title: `Recordatorio ${index}`,
      }),
    );

    const summary = selectReminderNotifications(occurrences, {
      todayKey: "2026-10-28",
      limit: 4,
    });

    expect(summary.items).toHaveLength(4);
    expect(summary.total).toBe(10);
  });
});

describe("formatNotificationDate", () => {
  it("describe los vencimientos dentro de la ventana", () => {
    expect(formatNotificationDate("2026-10-28", "2026-10-28")).toBe("Hoy");
    expect(formatNotificationDate("2026-10-29", "2026-10-28")).toBe("Mañana");
    expect(formatNotificationDate("2026-10-30", "2026-10-28")).toBe(
      "En 2 días",
    );
    expect(formatNotificationDate("2026-10-31", "2026-10-28")).toBe(
      "En 3 días",
    );
  });
});
