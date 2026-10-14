import { format, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { monthRangeFor } from "../utils/monthRange";
import { SHADOW } from "@/theme/globalStyles";
import { DashboardRange } from "../types";

export interface MonthSwitcherProps {
  anchor: Date;
  onChange: (range: DashboardRange) => void;
}

export const MonthSwitcher = ({ anchor, onChange }: MonthSwitcherProps) => {
  const label = format(anchor, "LLLL yyyy", { locale: es });
  const shift = (delta: number) => {
    const next = delta < 0 ? subMonths(anchor, 1) : addMonths(anchor, 1);
    onChange(monthRangeFor(next));
  };
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 420,
        mt: 2,
      }}>
      <IconButton
        aria-label="Mes anterior"
        onClick={() => shift(-1)}
        sx={{
          bgcolor: "background.paper",
          boxShadow: SHADOW,
        }}>
        <ChevronLeftIcon />
      </IconButton>

      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
        <CalendarMonthIcon fontSize="small" />
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Typography>

      <IconButton
        aria-label="Mes siguiente"
        onClick={() => shift(1)}
        sx={{
          bgcolor: "background.paper",
          boxShadow: SHADOW,
        }}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  );
};
