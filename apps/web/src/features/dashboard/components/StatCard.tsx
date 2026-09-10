import { ReactNode } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { North as NorthIcon, South as SouthIcon } from "@mui/icons-material";
import { SHADOW } from "@/theme/globalStyles";

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: "primary" | "success" | "error" | "warning" | "info";
  main?: boolean;
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
  main = false,
}: StatCardProps) => {
  return (
    <Card
      elevation={main ? 0 : undefined}
      sx={{
        height: "100%",
        borderLeft: 5,
        borderColor: () => (main ? "#0e131a" : colorMap[color]),
        boxShadow: SHADOW,
        bgcolor: () => (main ? "#0e131a" : null),
      }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 700, color: () => (main ? "#cfd8dc" : null) }}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: () => (main ? "#cfd8dc" : colorMap[color]),
                bgcolor: "rgba(5,6,7,.1)",
                width: 34,
                height: 34,
                borderRadius: 1,
                p: 2.5,
              }}>
              {icon}
            </Box>
          )}
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 700, color: colorMap[color] }}>
          {value}
        </Typography>
        {subtitle && (
          <Box sx={{ mt: 1, display: "flex", gap: 0.5 }}>
            {color === "success" ? (
              <NorthIcon color={color} sx={{ fontSize: 15 }} />
            ) : (
              <SouthIcon color={color} sx={{ fontSize: 15 }} />
            )}

            <Typography
              variant="caption"
              sx={{ color: () => (main ? "#cfd8dc" : null) }}>
              {subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
