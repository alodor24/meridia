import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUiStore } from "@/stores/uiStore";
import CollapsibleButton from "./CollapsibleButton";

beforeEach(() => {
  useUiStore.setState({ drawerCollapsed: false });
});

describe("CollapsibleButton", () => {
  it("colapsa el menú desde el estado expandido", async () => {
    const user = userEvent.setup();

    render(<CollapsibleButton />);

    const button = screen.getByRole("button", { name: "Contraer menú" });

    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);

    expect(useUiStore.getState().drawerCollapsed).toBe(true);
  });

  it("expande el menú desde el estado colapsado", async () => {
    useUiStore.setState({ drawerCollapsed: true });
    const user = userEvent.setup();

    render(<CollapsibleButton />);

    const button = screen.getByRole("button", { name: "Expandir menú" });

    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);

    expect(useUiStore.getState().drawerCollapsed).toBe(false);
  });
});
