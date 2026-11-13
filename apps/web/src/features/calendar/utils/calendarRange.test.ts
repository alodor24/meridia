import { afterEach, describe, expect, it, vi } from "vitest";
import {
  notificationRange,
  schedulerRange,
  upcomingRange,
} from "./calendarRange";

afterEach(() => {
  vi.useRealTimers();
});

describe("schedulerRange", () => {
  it("incluye las semanas completas del mes", () => {
    expect(schedulerRange(new Date(2026, 9, 15), "month")).toEqual({
      from: "2026-09-28",
      to: "2026-11-01",
    });
  });

  it("devuelve una semana completa para la vista semanal", () => {
    expect(schedulerRange(new Date(2026, 9, 15), "week")).toEqual({
      from: "2026-09-28",
      to: "2026-11-01",
    });
  });

  it("cubre los próximos 30 días para la vista agenda", () => {
    expect(schedulerRange(new Date(2026, 9, 15), "agenda")).toEqual({
      from: "2026-10-15",
      to: "2026-11-13",
    });
  });
});

describe("upcomingRange", () => {
  it("calcula los próximos 30 días desde hoy", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 1, 12, 0, 0));

    expect(upcomingRange(30)).toEqual({
      from: "2026-10-01",
      to: "2026-10-31",
    });
  });
});

describe("notificationRange", () => {
  it("calcula la ventana desde hoy hasta dentro de 3 días", () => {
    expect(notificationRange("2026-10-28")).toEqual({
      from: "2026-10-28",
      to: "2026-10-31",
    });
  });
});
