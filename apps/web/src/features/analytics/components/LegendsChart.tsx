import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const legends = [
  { title: "Ingresos", color: "success" },
  { title: "Gastos", color: "error" },
  { title: "Balance", color: "primary" },
] as const;

const LegendsChart = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        pr: 2,
        flexShrink: 0,
        mb: 2,
      }}>
      <List sx={{ p: 0, display: "flex", gap: 3 }}>
        {legends.map((legend) => (
          <ListItem key={legend.title} disablePadding>
            <FiberManualRecordIcon fontSize="small" color={legend.color} />
            <Typography variant="caption">{legend.title}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LegendsChart;
