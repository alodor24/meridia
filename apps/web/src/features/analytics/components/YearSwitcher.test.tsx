import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import YearSwitcher from "./YearSwitcher";

const mocks = vi.hoisted(() => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: mocks.useCurrentUser,
}));

const currentYear = new Date().getFullYear();
const firstYear = currentYear - 2;

beforeEach(() => {
  mocks.useCurrentUser.mockReturnValue({
    data: { createdAt: `${firstYear}-06-15T12:00:00.000Z` },
  });
});

describe("YearSwitcher", () => {
  it("muestra el año seleccionado y navega con los chevrons", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearSwitcher year={currentYear - 1} onChange={onChange} />);

    expect(screen.getByText(String(currentYear - 1))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Año anterior" }));
    expect(onChange).toHaveBeenCalledWith(firstYear);

    await user.click(screen.getByRole("button", { name: "Año siguiente" }));
    expect(onChange).toHaveBeenLastCalledWith(currentYear);
  });

  it("deshabilita los chevrons en los límites del rango", () => {
    const { rerender } = render(
      <YearSwitcher year={firstYear} onChange={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Año anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Año siguiente" })).toBeEnabled();

    rerender(<YearSwitcher year={currentYear} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Año anterior" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Año siguiente" }),
    ).toBeDisabled();
  });

  it("abre el menú y selecciona un año", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearSwitcher year={currentYear} onChange={onChange} />);

    await user.click(
      screen.getByRole("button", {
        name: `Año ${currentYear}. Abrir lista de años`,
      }),
    );

    const menu = await screen.findByRole("menu", {
      name: "Años disponibles",
    });

    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual([currentYear, currentYear - 1, firstYear].map(String));

    await user.click(
      within(menu).getByRole("menuitem", { name: String(firstYear) }),
    );

    expect(onChange).toHaveBeenCalledWith(firstYear);
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("vuelve al año actual", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearSwitcher year={firstYear} onChange={onChange} />);

    await user.click(
      screen.getByRole("button", { name: "Volver al año actual" }),
    );

    expect(onChange).toHaveBeenCalledWith(currentYear);
  });

  it("navega con las flechas del teclado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<YearSwitcher year={currentYear - 1} onChange={onChange} />);

    screen
      .getByRole("button", {
        name: `Año ${currentYear - 1}. Abrir lista de años`,
      })
      .focus();

    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(currentYear);

    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenLastCalledWith(firstYear);
  });
});
