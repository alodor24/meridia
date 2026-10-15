import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarMonthIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { monthRangeFor } from "../utils/monthRange";
import { SHADOW } from "@/theme/globalStyles";
import { DashboardRange } from "../types";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import CustomTooltip from "@/components/ui/CustomTooltip";

interface MonthSwitcherProps {
  anchor: Date;
  onChange: (range: DashboardRange) => void;
}

export const MonthSwitcher = ({ anchor, onChange }: MonthSwitcherProps) => {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  const currentDate = new Date();
  const registrationDate = new Date(user.createdAt);
  const label = format(anchor, "LLLL yyyy", { locale: es });
  const isCurrentMonth = isSameMonth(anchor, currentDate);

  const isPreviousDisabled =
    startOfMonth(anchor) <= startOfMonth(registrationDate);

  const isNextDisabled = startOfMonth(anchor) >= startOfMonth(currentDate);

  const shift = (delta: number) => {
    const next = delta < 0 ? subMonths(anchor, 1) : addMonths(anchor, 1);
    onChange(monthRangeFor(next));
  };

  const goToCurrentMonth = () => {
    onChange(monthRangeFor(currentDate));
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
      <CustomTooltip title="Mes anterior" placement="top">
        <IconButton
          aria-label="Mes anterior"
          onClick={() => shift(-1)}
          disabled={isPreviousDisabled}
          sx={{
            bgcolor: "background.paper",
            boxShadow: SHADOW,
          }}>
          <ChevronLeftIcon />
        </IconButton>
      </CustomTooltip>

      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}>
          <CalendarMonthIcon fontSize="small" />
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Typography>

        {!isCurrentMonth && (
          <CustomTooltip title="Volver a hoy" placement="top">
            <IconButton
              aria-label="Volver a hoy"
              onClick={goToCurrentMonth}
              sx={{
                bgcolor: "background.paper",
                boxShadow: SHADOW,
                borderRadius: 1,
              }}>
              <RefreshIcon color="primary" sx={{ fontSize: 14 }} />
            </IconButton>
          </CustomTooltip>
        )}
      </Stack>

      <CustomTooltip title="Mes siguiente" placement="top">
        <IconButton
          aria-label="Mes siguiente"
          onClick={() => shift(1)}
          disabled={isNextDisabled}
          sx={{
            bgcolor: "background.paper",
            boxShadow: SHADOW,
          }}>
          <ChevronRightIcon />
        </IconButton>
      </CustomTooltip>
    </Stack>
  );
};
