import type { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useUiStore } from '@/stores/uiStore';

export function AppProviders({ children }: { children: ReactNode }) {
  const themeMode = useUiStore((s) => s.themeMode);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: '#4f6bff' },
      secondary: { main: '#00b8a9' },
      background: {
        default: themeMode === 'light' ? '#f6f7fb' : '#121212',
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
