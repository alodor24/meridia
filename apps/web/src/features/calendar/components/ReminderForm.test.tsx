import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { ReminderForm } from "./ReminderForm";

const mocks = vi.hoisted(() => ({
  createReminder: vi.fn(),
  updateReminder: vi.fn(),
}));

vi.mock("../hooks/useCreateReminder", () => ({
  useCreateReminder: () => ({
    mutateAsync: mocks.createReminder,
    isPending: false,
  }),
}));

vi.mock("../hooks/useUpdateReminder", () => ({
  useUpdateReminder: () => ({
    mutateAsync: mocks.updateReminder,
    isPending: false,
  }),
}));

const renderForm = () =>
  render(
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <ReminderForm
        occurrence={null}
        defaultDate="2026-10-23"
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />
    </LocalizationProvider>,
  );

describe("ReminderForm", () => {
  beforeEach(() => {
    mocks.createReminder.mockReset();
    mocks.updateReminder.mockReset();
    mocks.createReminder.mockResolvedValue({});
  });

  it("crea un recordatorio único con el título y la fecha", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Título"), "Alquiler");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(mocks.createReminder).toHaveBeenCalledWith({
        title: "Alquiler",
        date: "2026-10-23",
        recurrence: null,
      }),
    );
  });

  it("envía la recurrencia personalizada", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Título"), "Alquiler");
    await user.click(screen.getByLabelText("Repetir"));
    await user.clear(screen.getByLabelText("Cada"));
    await user.type(screen.getByLabelText("Cada"), "2");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(mocks.createReminder).toHaveBeenCalledWith({
        title: "Alquiler",
        date: "2026-10-23",
        recurrence: {
          unit: "month",
          interval: 2,
          endDate: null,
        },
      }),
    );
  });
});
