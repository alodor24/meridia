import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { SHADOW } from "@/theme/globalStyles";
import { buildYearOptions } from "../utils/yearOptions";

interface YearSwitcherProps {
  year: number;
  minYear: number;
  maxYear: number;
  onChange: (year: number) => void;
}

const YearSwitcher = ({
  year,
  minYear,
  maxYear,
  onChange,
}: YearSwitcherProps) => {
  const years = buildYearOptions(minYear, maxYear);

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <CustomTooltip title="Año anterior" placement="top">
        <IconButton
          aria-label="Año anterior"
          onClick={() => onChange(year - 1)}
          disabled={year <= minYear}
          sx={{
            bgcolor: "background.paper",
            boxShadow: SHADOW,
          }}>
          <ChevronLeftIcon />
        </IconButton>
      </CustomTooltip>

      <Select
        size="small"
        value={year}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Año"
        sx={{
          minWidth: 96,
          bgcolor: "background.paper",
          boxShadow: SHADOW,
          "& .MuiSelect-select": {
            py: 1,
            fontWeight: 600,
          },
        }}>
        {years.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>

      <CustomTooltip title="Año siguiente" placement="top">
        <IconButton
          aria-label="Año siguiente"
          onClick={() => onChange(year + 1)}
          disabled={year >= maxYear}
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

export default YearSwitcher;
