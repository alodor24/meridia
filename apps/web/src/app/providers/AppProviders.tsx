import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useUiStore } from "@/stores/uiStore";
import globalStyles from "@/theme/globalStyles";
import createAppTheme from "@/theme/theme";
import queryClient from "@/services/query/queryClient";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const themeMode = useUiStore((s) => s.themeMode);
  const theme = createAppTheme(themeMode);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};
