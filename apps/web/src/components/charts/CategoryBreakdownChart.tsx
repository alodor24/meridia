import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import type { CategoryTotal } from "@meridia/shared";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { EmptyState } from "@/components/ui/States";
import { DONOUT_OPTIONS } from "@/conts";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownChartProps {
  items: CategoryTotal[];
  currency: string;
  emptyMessage: string;
}

const CategoryBreakdownChart = ({
  items = [],
  currency,
  emptyMessage,
}: CategoryBreakdownChartProps) => {
  const theme = useTheme();
  const total = items.reduce((sum, item) => sum + item.total, 0);

  const chartData = {
    labels: items.map((item) => item.name),
    datasets: [
      {
        label: `Total ${currency}`,
        data: items.map((item) => item.total),
        backgroundColor: items.map((item) => item.color),
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <Box sx={{ mt: 2, height: 374, bgcolor: "background.paper" }}>
      {items.length > 0 ? (
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid size={7}>
            <Doughnut data={chartData} options={DONOUT_OPTIONS} />
          </Grid>
          <Grid size={5}>
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}>
              {items.map((item) => (
                <ListItem key={item.categoryId} sx={{ p: 0 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            height: 12,
                            width: 12,
                            bgcolor: item.color,
                            borderRadius: 5,
                          }}
                        />
                        <Typography sx={{ fontSize: 12 }}>
                          {item.name} -
                          {total > 0 &&
                            ` ${Math.round((item.total / total) * 100)}%`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </Box>
  );
};

export default CategoryBreakdownChart;
