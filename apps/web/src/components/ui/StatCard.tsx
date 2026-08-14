import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: "primary" | "success" | "error" | "warning" | "info";
}

const colorMap = {
  primary: "primary.main",
  success: "success.main",
  error: "error.main",
  warning: "warning.main",
  info: "info.main",
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
}: StatCardProps) => {
  return (
    <Card
      elevation={3}
      sx={{ height: "100%" }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {icon && <Box sx={{ color: colorMap[color] }}>{icon}</Box>}
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 700, color: colorMap[color] }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
