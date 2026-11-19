import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SHADOW } from "@/theme/globalStyles";
import {
  PercentageChange,
  TrendDirection,
  TrendStatus,
} from "@/utils/calculatePctChange";
import CurrencyDisplay from "./CurrencyDisplay";

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string | ReactNode;
  icon?: ReactNode;
  color?: "primary" | "success" | "error" | "warning" | "info";
  main?: boolean;
  comparison?: PercentageChange;
  amountVisibility: boolean;
  toggleAmountVisibility: () => void;
}

const colorMap = {
  primary: "primary.main",
  success: "success.main",
  error: "error.main",
  warning: "warning.main",
  info: "info.main",
};

const trendIconMap: Record<TrendDirection, ReactNode> = {
  up: <NorthIcon sx={{ fontSize: 15 }} />,
  down: <SouthIcon sx={{ fontSize: 15 }} />,
  neutral: <SyncAltIcon sx={{ fontSize: 15 }} />,
};

const trendColorMap: Record<TrendStatus, string> = {
  positive: "success.main",
  negative: "error.main",
  neutral: "info.main",
  unavailable: "info.main",
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  main = false,
  comparison,
  amountVisibility,
  toggleAmountVisibility,
}: StatCardProps) => {
  const trend = comparison?.direction ?? "neutral";
  const status = comparison?.status ?? "neutral";

  const trendColor = trendColorMap[status];

  return (
    <Card
      elevation={main ? 0 : undefined}
      sx={{
        height: "100%",
        borderLeft: 5,
        borderColor: main ? "#0e131a" : colorMap[color],
        boxShadow: SHADOW,
        bgcolor: main ? "#0e131a" : null,
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
            sx={{
              fontWeight: 700,
              color: main ? "#cfd8dc" : "text.primary",
            }}>
            {title}
          </Typography>

          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: main ? "#cfd8dc" : colorMap[color],
                bgcolor: main ? "#050607" : "background.default",
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
          sx={{
            fontWeight: 700,
            color: colorMap[color],
          }}>
          {amountVisibility ? <CurrencyDisplay value={value} /> : "**********"}

          <IconButton
            aria-label="visibility"
            size="small"
            sx={{ color: "text.primary" }}
            onClick={toggleAmountVisibility}>
            {amountVisibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Typography>

        {(comparison || subtitle) && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}>
            {comparison && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: trendColor,
                }}>
                {trendIconMap[trend]}{" "}
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {comparison.label}
                </Typography>
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                color: main ? "#cfd8dc" : "text.secondary",
              }}>
              {subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
