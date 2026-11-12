import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

interface UiState {
  drawerOpen: boolean;
  drawerCollapsed: boolean;
  themeMode: ThemeMode;
  snackbar: SnackbarState;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawerCollapsed: () => void;
  setDrawerCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  showSnackbar: (message: string, severity?: SnackbarState["severity"]) => void;
  hideSnackbar: () => void;
}

const initialSnackbar: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      drawerOpen: false,
      drawerCollapsed: false,
      themeMode: "light",
      snackbar: initialSnackbar,

      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
      setDrawerOpen: (open) => set({ drawerOpen: open }),

      toggleDrawerCollapsed: () =>
        set((state) => ({ drawerCollapsed: !state.drawerCollapsed })),
      setDrawerCollapsed: (collapsed) => set({ drawerCollapsed: collapsed }),

      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
      setThemeMode: (mode) => set({ themeMode: mode }),

      showSnackbar: (message, severity = "success") =>
        set({ snackbar: { open: true, message, severity } }),
      hideSnackbar: () =>
        set((state) => ({
          snackbar: {
            ...state.snackbar,
            open: false,
          },
        })),
    }),
    {
      name: "meridia-ui",
      partialize: (state) => ({
        themeMode: state.themeMode,
        drawerCollapsed: state.drawerCollapsed,
      }),
    },
  ),
);
