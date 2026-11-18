import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReminderOccurrence } from "@meridia/shared";
import { NotificationsBell } from "./NotificationsBell";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  reminderNotifications: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
  Link: "a",
}));

vi.mock("@/features/calendar/hooks/useReminderNotifications", () => ({
  useReminderNotifications: () => mocks.reminderNotifications(),
}));

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

const mockReminders = (overrides: Record<string, unknown> = {}) => {
  const items = [buildOccurrence()];
  mocks.reminderNotifications.mockReturnValue({
    query: { isLoading: false, isError: false, refetch: vi.fn() },
    todayKey: "2026-10-28",
    items,
    total: items.length,
    todayCount: 1,
    upcomingCount: 0,
    ...overrides,
  });
};

describe("NotificationsBell", () => {
  beforeEach(() => {
    mocks.navigate.mockReset();
    mocks.reminderNotifications.mockReset();
    mockReminders();
  });

  it("muestra los recordatorios y navega al calendario", async () => {
    const user = userEvent.setup();
    render(<NotificationsBell />);

    const bell = screen.getByRole("button", {
      name: "Notificaciones: 1 novedad",
    });
    await user.click(bell);

    expect(
      await screen.findByText("Recordatorios próximos"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Alquiler/ }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      to: "/app/calendar",
      search: { date: "2026-10-28" },
    });
  });

  it("muestra el estado vacío cuando no hay novedades", async () => {
    mocks.reminderNotifications.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      todayKey: "2026-10-28",
      items: [],
      total: 0,
      todayCount: 0,
      upcomingCount: 0,
    });

    const user = userEvent.setup();
    render(<NotificationsBell />);

    await user.click(
      screen.getByRole("button", {
        name: "Notificaciones: no hay novedades",
      }),
    );

    expect(
      await screen.findByText("No hay novedades por ahora"),
    ).toBeInTheDocument();
  });
});
