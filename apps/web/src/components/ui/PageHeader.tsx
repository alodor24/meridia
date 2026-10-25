import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomButtom from "./CustomButtom";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryAction,
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
      {(secondaryAction || (actionLabel && onAction)) && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {secondaryAction}
          {actionLabel && onAction && (
            <CustomButtom onAction={onAction}>{actionLabel}</CustomButtom>
          )}
        </Stack>
      )}
    </Box>
  );
};
