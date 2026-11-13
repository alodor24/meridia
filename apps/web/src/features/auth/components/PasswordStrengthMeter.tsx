import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircle from "@mui/icons-material/CheckCircle";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import { useTheme } from "@mui/material/styles";
import {
  getPasswordStrength,
  PASSWORD_REQUIREMENTS,
} from "../utils/passwordStrength";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const theme = useTheme();
  const strength = getPasswordStrength(password);
  const activeColor = theme.palette[strength.color].main;
  const inactiveColor = theme.palette.action.disabledBackground;
  const showMeter = password.length > 0;

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          minHeight: 20,
        }}>
        <Typography variant="caption" color="text.secondary">
          Seguridad de la contraseña
        </Typography>

        {showMeter ? (
          <Typography
            variant="caption"
            aria-live="polite"
            sx={{ color: activeColor, fontWeight: 600 }}>
            {strength.label}
          </Typography>
        ) : null}
      </Box>

      {showMeter ? (
        <Box
          role="progressbar"
          aria-label="Seguridad de la contraseña"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength.level}
          aria-valuetext={strength.label}
          sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                height: 6,
                flex: 1,
                borderRadius: 1,
                backgroundColor:
                  index <= strength.level ? activeColor : inactiveColor,
                transition: "background-color 150ms ease",
              }}
            />
          ))}
        </Box>
      ) : null}

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          mt: 1,
          p: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: 2,
          rowGap: 0.5,
        }}>
        {PASSWORD_REQUIREMENTS.map((requirement) => {
          const met = strength.checks[requirement.key];

          return (
            <Box
              key={requirement.key}
              component="li"
              sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {met ? (
                <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
              ) : (
                <RadioButtonUnchecked
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
              )}
              <Typography
                variant="caption"
                color={met ? "success.main" : "text.secondary"}>
                {requirement.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PasswordStrengthMeter;
