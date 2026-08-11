import type { ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8, textAlign: 'center' }}>
      <InboxIcon color="disabled" sx={{ fontSize: 48 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
      {action}
    </Box>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8, textAlign: 'center' }}>
      <Typography variant="body1" color="error">
        {message}
      </Typography>
      {onRetry && (
        <Typography component="div">
          <button
            type="button"
            onClick={onRetry}
            style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'inherit', textDecoration: 'underline' }}
          >
            Reintentar
          </button>
        </Typography>
      )}
    </Box>
  );
}
