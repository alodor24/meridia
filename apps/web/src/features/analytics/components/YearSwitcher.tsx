import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { SHADOW } from "@/theme/globalStyles";
import useYearSwitcher from "../hooks/useYearSwitcher";

interface YearSwitcherProps {
  year: number;
  onChange: (year: number) => void;
}

const stepButtonSx = {
  borderRadius: 0,
  width: 44,
  height: 44,
  color: "text.secondary",
  "&:hover": { color: "primary.main", bgcolor: "action.hover" },
};

const YearSwitcher = ({ year, onChange }: YearSwitcherProps) => {
  const {
    handleKeyDown,
    minYear,
    selectYear,
    isMenuOpen,
    setMenuAnchor,
    maxYear,
    menuAnchor,
    years,
  } = useYearSwitcher({
    year,
    onChange,
  });

  return (
    <Box
      role="group"
      aria-label="Selector de año"
      onKeyDown={handleKeyDown}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 10,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: SHADOW,
        overflow: "hidden",
      }}>
      <CustomTooltip title="Año anterior">
        <span>
          <IconButton
            aria-label="Año anterior"
            disabled={year <= minYear}
            onClick={() => selectYear(year - 1)}
            sx={stepButtonSx}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </span>
      </CustomTooltip>

      <Divider orientation="vertical" flexItem sx={{ my: 1.25 }} />

      <ButtonBase
        aria-label={`Año ${year}. Abrir lista de años`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-controls={isMenuOpen ? "year-switcher-menu" : undefined}
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{
          height: 44,
          px: 1.75,
          gap: 2,
          color: "text.primary",
          "&:hover": { bgcolor: "action.hover" },
        }}>
        <CalendarMonthIcon fontSize="small" />
        <Typography
          variant="subtitle1"
          component="span"
          sx={{
            fontWeight: 700,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}>
          {year}
        </Typography>
        <ArrowDropDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
      </ButtonBase>

      <Divider orientation="vertical" flexItem sx={{ my: 1.25 }} />

      <CustomTooltip title="Año siguiente">
        <span>
          <IconButton
            aria-label="Año siguiente"
            disabled={year >= maxYear}
            onClick={() => selectYear(year + 1)}
            sx={stepButtonSx}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </span>
      </CustomTooltip>

      {year !== maxYear && (
        <>
          <Divider orientation="vertical" flexItem sx={{ my: 1.25 }} />

          <CustomTooltip title="Volver al año actual">
            <IconButton
              aria-label="Volver al año actual"
              onClick={() => selectYear(maxYear)}
              sx={{ ...stepButtonSx, color: "primary.main" }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        </>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 130,
              p: 1,
              borderRadius: 1,
              boxShadow: SHADOW,
            },
          },
          list: {
            id: "year-switcher-menu",
            "aria-label": "Años disponibles",
          },
        }}>
        {years.map((option) => {
          const isSelected = option === year;

          return (
            <MenuItem
              key={option}
              selected={isSelected}
              onClick={() => {
                selectYear(option);
                setMenuAnchor(null);
              }}
              sx={{
                justifyContent: "center",
                gap: 0.75,
                py: 1,
                borderRadius: 1,
                fontWeight: isSelected ? 700 : 500,
                fontSize: 14,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
                "&.Mui-selected:hover": { bgcolor: "primary.dark" },
              }}>
              {isSelected && <CheckIcon fontSize="small" />}
              {option}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default YearSwitcher;
