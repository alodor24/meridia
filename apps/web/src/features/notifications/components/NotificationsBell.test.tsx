import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  AppNotification,
  GoalId,
  NotificationId,
  ReminderOccurrence,
} from "@meridia/shared";
import { NotificationsBell } from "./NotificationsBell";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  reminderNotifications: vi.fn(),
  notifications: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/calendar/hooks/useReminderNotifications", () => ({
  useReminderNotifications: () => mocks.reminderNotifications(),
}));

vi.mock("../hooks/useNotifications", () => ({
  useNotifications: () => mocks.notifications(),
}));

vi.mock("../hooks/useMarkNotificationRead", () => ({
  useMarkNotificationRead: () => ({ mutateAsync: mocks.markRead }),
}));

vi.mock("../hooks/useMarkAllNotificationsRead", () => ({
  useMarkAllNotificationsRead: () => ({
    mutateAsync: mocks.markAllRead,
    isPending: false,
  }),
}));

const buildNotification = (
  overrides: Partial<AppNotification> = {},
): AppNotification => ({
  id: "notification-1" as NotificationId,
  type: "goal_completed",
  goalId: "goal-1" as GoalId,
  title: "¡Meta completada!",
  message: 'Alcanzaste tu meta "Auto" en la cuenta "Ahorro".',
  readAt: null,
  createdAt: "2026-10-28T12:00:00.000Z",
  ...overrides,
});

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

const mockNotifications = (overrides: Record<string, unknown> = {}) => {
  const items = [buildNotification()];
  mocks.notifications.mockReturnValue({
    data: { items, total: items.length, unreadCount: 1 },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  });
};

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
    mocks.notifications.mockReset();
    mocks.markRead.mockReset().mockResolvedValue(undefined);
    mocks.markAllRead.mockReset().mockResolvedValue({ marked: 1 });
    mockNotifications();
    mockReminders();
  });

  it("muestra metas completadas y recordatorios, y navega a la meta", async () => {
    const user = userEvent.setup();
    render(<NotificationsBell />);

    const bell = screen.getByRole("button", {
      name: "Notificaciones: 2 novedades",
    });
    await user.click(bell);

    expect(await screen.findByText("Metas completadas")).toBeInTheDocument();
    expect(screen.getByText("Recordatorios próximos")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Meta completada/ }));

    await waitFor(() =>
      expect(mocks.markRead).toHaveBeenCalledWith("notification-1"),
    );
    expect(mocks.navigate).toHaveBeenCalledWith({
      to: "/app/goals",
      search: { tab: "finalizadas" },
    });
  });

  it("navega al calendario al elegir un recordatorio", async () => {
    const user = userEvent.setup();
    render(<NotificationsBell />);

    await user.click(screen.getByRole("button", { name: /Notificaciones/ }));
    await user.click(screen.getByRole("button", { name: /Alquiler/ }));

    expect(mocks.navigate).toHaveBeenCalledWith({
      to: "/app/calendar",
      search: { date: "2026-10-28" },
    });
  });

  it("permite marcar todas las notificaciones como leídas", async () => {
    const user = userEvent.setup();
    render(<NotificationsBell />);

    await user.click(screen.getByRole("button", { name: /Notificaciones/ }));
    await user.click(
      screen.getByRole("button", { name: "Marcar todas como leídas" }),
    );

    expect(mocks.markAllRead).toHaveBeenCalled();
  });

  it("muestra el estado vacío cuando no hay novedades", async () => {
    mocks.notifications.mockReturnValue({
      data: { items: [], total: 0, unreadCount: 0 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
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
      await screen.findByText("No hay novedades por ahora."),
    ).toBeInTheDocument();
  });
});
