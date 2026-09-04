import type { ReactNode } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export const LoadingState = ({ label = "Cargando…" }: { label?: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
      }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export const EmptyState = ({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}>
      <InboxIcon color="disabled" sx={{ fontSize: 48 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
      {action}
    </Box>
  );
};

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  return (
    <Box
      role="alert"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}>
      <Typography variant="body1" color="error">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" size="small" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Box>
  );
};
