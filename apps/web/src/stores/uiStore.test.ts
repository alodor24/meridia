import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./uiStore";

const readPersistedState = () => {
  const raw = localStorage.getItem("meridia-ui");
  return raw ? JSON.parse(raw).state : null;
};

describe("uiStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useUiStore.setState({ themeMode: "light", drawerCollapsed: false });
  });

  it("alterna el drawer colapsado y lo persiste en localStorage", () => {
    useUiStore.getState().toggleDrawerCollapsed();

    expect(useUiStore.getState().drawerCollapsed).toBe(true);
    expect(readPersistedState()).toMatchObject({
      themeMode: "light",
      drawerCollapsed: true,
    });
    expect(readPersistedState()).not.toHaveProperty("drawerOpen");
  });

  it("setDrawerCollapsed fija el valor indicado", () => {
    useUiStore.getState().setDrawerCollapsed(true);
    expect(useUiStore.getState().drawerCollapsed).toBe(true);

    useUiStore.getState().setDrawerCollapsed(false);
    expect(useUiStore.getState().drawerCollapsed).toBe(false);
  });
});
