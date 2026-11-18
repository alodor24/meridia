import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LegendDotProps {
  color: string;
  label: string;
}

const LegendDot = ({ color, label }: LegendDotProps) => {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
};

export default LegendDot;
