import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useUiStore } from "@/stores/uiStore";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const themeMode = useUiStore((s) => s.themeMode);

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
      divider: themeMode === "light" ? "#e0e0e0" : "#212121",
    },
    shape: { borderRadius: 3 },
    typography: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "::selection": {
            backgroundColor: "#42a5f5",
            color: "#fff",
          },
          ":focus-visible": {
            outline: "2px solid #4f6bff",
            outlineOffset: 2,
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.01ms !important",
              scrollBehavior: "auto !important",
            },
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
};
