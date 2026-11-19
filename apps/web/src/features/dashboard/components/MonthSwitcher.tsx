import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SHADOW } from "@/theme/globalStyles";
import { DashboardRange } from "../types";
import CustomTooltip from "@/components/ui/CustomTooltip";
import useMonthSwitcher from "../hooks/useMonthSwitcher";

interface MonthSwitcherProps {
  anchor: Date;
  onChange: (range: DashboardRange) => void;
}

export const MonthSwitcher = ({ anchor, onChange }: MonthSwitcherProps) => {
  const {
    shift,
    isPreviousDisabled,
    isNextDisabled,
    isCurrentMonth,
    label,
    goToCurrentMonth,
  } = useMonthSwitcher({ anchor, onChange });

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
          {label}
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
