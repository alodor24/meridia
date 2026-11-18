import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUiStore } from "@/stores/uiStore";
import FeedbackForm from "./FeedbackForm";

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
}));

vi.mock("../hooks/useCreateFeedback", () => ({
  useCreateFeedback: () => ({
    mutateAsync: mocks.mutateAsync,
    isPending: false,
  }),
}));

beforeEach(() => {
  mocks.mutateAsync.mockReset().mockResolvedValue({});
  useUiStore.setState({
    snackbar: { open: false, message: "", severity: "info" },
  });
});

describe("FeedbackForm", () => {
  it("envía el mensaje y muestra la confirmación", async () => {
    const user = userEvent.setup({ delay: null });
    render(<FeedbackForm />);

    await user.click(screen.getByLabelText("Asunto"));
    await user.paste("Mejorar los filtros");
    await user.click(screen.getByLabelText("Mensaje"));
    await user.paste("Me gustaría poder guardar filtros de movimientos.");
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        type: "suggestion",
        subject: "Mejorar los filtros",
        message: "Me gustaría poder guardar filtros de movimientos.",
      });
    });

    expect(useUiStore.getState().snackbar.message).toBe(
      "¡Gracias! Tu mensaje ha sido enviado.",
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Asunto")).toHaveValue("");
    });
  });
});
