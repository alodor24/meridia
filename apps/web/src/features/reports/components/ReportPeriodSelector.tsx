import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { format, parseISO } from "date-fns";
import type { ReportPeriodKind, ReportSelection } from "../types";
import { MONTH_OPTIONS } from "../utils/reportPeriod";
import { PERIOD_OPTIONS } from "../consts";

interface ReportPeriodSelectorProps {
  selection: ReportSelection;
  yearOptions: number[];
  onChange: (patch: Partial<ReportSelection>) => void;
}

const ReportPeriodSelector = ({
  selection,
  yearOptions,
  onChange,
}: ReportPeriodSelectorProps) => {
  return (
    <Stack spacing={4}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={selection.period}
        onChange={(_event, value: ReportPeriodKind | null) => {
          if (value) onChange({ period: value });
        }}
        aria-label="Período del reporte">
        {PERIOD_OPTIONS.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
        {selection.period === "monthly" && (
          <>
            <Box sx={{ width: { xs: "100%", sm: 180 } }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Mes"
                value={selection.month}
                onChange={(event) =>
                  onChange({ month: Number(event.target.value) })
                }>
                {MONTH_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ width: { xs: "100%", sm: 140 } }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Año"
                value={selection.year}
                onChange={(event) =>
                  onChange({ year: Number(event.target.value) })
                }>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </>
        )}

        {selection.period === "annual" && (
          <Box sx={{ width: { xs: "100%", sm: 140 } }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Año"
              value={selection.year}
              onChange={(event) =>
                onChange({ year: Number(event.target.value) })
              }>
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {selection.period === "custom" && (
          <>
            <Box sx={{ width: { xs: "100%", sm: 190 } }}>
              <DesktopDatePicker
                label="Desde"
                value={selection.from ? parseISO(selection.from) : null}
                onChange={(date) =>
                  onChange({
                    from: date ? format(date, "yyyy-MM-dd") : "",
                  })
                }
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: 190 } }}>
              <DesktopDatePicker
                label="Hasta"
                value={selection.to ? parseISO(selection.to) : null}
                onChange={(date) =>
                  onChange({
                    to: date ? format(date, "yyyy-MM-dd") : "",
                  })
                }
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ReportPeriodSelector;
