import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { isValid } from "date-fns";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { SHADOW } from "@/theme/globalStyles";
import { buildYearRange } from "../utils/yearOptions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface YearSwitcherProps {
  year: number;
  onChange: (year: number) => void;
}

const YearSwitcher = ({ year, onChange }: YearSwitcherProps) => {
  const { data: user } = useCurrentUser();
  const { min: minYear, max: maxYear } = buildYearRange(user?.createdAt);

  return (
    <Card sx={{ mb: 2, boxShadow: SHADOW }}>
      <CardContent sx={{ pt: 3 }}>
        <DesktopDatePicker
          label="Año"
          value={new Date(year, 0, 1)}
          onChange={(date) => {
            if (date && isValid(date)) onChange(date.getFullYear());
          }}
          views={["year"]}
          openTo="year"
          format="yyyy"
          minDate={new Date(minYear, 0, 1)}
          maxDate={new Date(maxYear, 11, 31)}
          slotProps={{
            textField: {
              size: "small",
              slotProps: {
                htmlInput: { "aria-label": "Año" },
              },
              sx: {
                width: 240,
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default YearSwitcher;
