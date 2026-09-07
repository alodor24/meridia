import { format, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import type { DashboardRange } from "../services/api";
import { monthRangeFor } from "../utils/monthRange";

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
      <IconButton aria-label="Mes anterior" onClick={() => shift(-1)}>
        <ChevronLeftIcon />
      </IconButton>

      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>

      <IconButton aria-label="Mes siguiente" onClick={() => shift(1)}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  );
};
