import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{
            background: (theme) =>
              `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
          }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
