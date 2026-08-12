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
      primary: { main: "#4f6bff" },
      secondary: { main: "#00b8a9" },
      background: {
        default: themeMode === "light" ? "#fafafa" : "#141616",
      },
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
