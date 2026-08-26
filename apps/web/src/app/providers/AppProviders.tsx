import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useUiStore } from "@/stores/uiStore";
import globalStyles from "@/styles/globalStyles";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const themeMode = useUiStore((s) => s.themeMode);

  const fontFamily = "'Mulish', sans-serif";

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === "light" ? "#5e35b1" : "#2962ff",
        contrastText: "#fff",
      },
      secondary: {
        main: "#4dd0e1",
        contrastText: "#fff",
      },
      error: {
        main: "#e53935",
      },
      warning: {
        main: "#ff9800",
      },
      info: {
        main: "#2196f3",
      },
      success: {
        main: "#4caf50",
      },
      background: {
        default: themeMode === "light" ? "#eceff1" : "#050607",
        paper: themeMode === "light" ? "#fff" : "#0e131a",
      },
      text: {
        primary: themeMode === "light" ? "#37474f" : "#cfd8dc",
      },
      divider: themeMode === "light" ? "#e0e0e0" : "#424242",
    },
    shape: { borderRadius: 3 },
    typography: {
      fontFamily: fontFamily,
    },

    components: {
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          }),
          head: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
      },
      MuiTable: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&.Mui-selected": {
              backgroundColor: theme.palette.action.selected,
              color: theme.palette.primary.main,

              "&:hover": {
                backgroundColor: theme.palette.action.selected,
              },
            },
          }),
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,

            ".Mui-selected &": {
              color: theme.palette.primary.main,
            },
          }),
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};
