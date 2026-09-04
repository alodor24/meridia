import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

const fontFamily = "'Mulish', sans-serif";

const createAppTheme = (themeMode: PaletteMode) => {
    return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#0050de",
        contrastText: "#fff",
      },
      secondary: {
        main: "#42a5f5",
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
    shape: { borderRadius: 8 },
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
            borderRadius: theme.shape.borderRadius,
            ".MuiListItemText-root": {
              "span": {
                fontSize: "0.9rem",
              },
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary,
              color: theme.palette.secondary.main,

              "&:hover": {
                backgroundColor: theme.palette.secondary,
                color: theme.palette.secondary.main,
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
              color: theme.palette.secondary.main,
            },
          }),
        },
      },
    },
  });
};

export default createAppTheme;