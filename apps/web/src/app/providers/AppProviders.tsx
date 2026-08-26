import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useUiStore } from "@/stores/uiStore";
import globalStyles from "@/theme/globalStyles";
import createAppTheme from "@/theme/theme";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const themeMode = useUiStore((s) => s.themeMode);

  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};
