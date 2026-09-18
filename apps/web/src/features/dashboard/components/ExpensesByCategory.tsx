import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { EmptyState } from "@/components/ui/States";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DONOUT_OPTIONS } from "@/conts";

interface ExpensesByCategoryItem {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

interface ExpensesByCategoryProps {
  items: ExpensesByCategoryItem[];
  currency: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpensesByCategory = ({
  items = [],
  currency,
}: ExpensesByCategoryProps) => {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  const chartData = {
    labels: items.map((item) => item.name),
    datasets: [
      {
        label: `Total ${currency}`,
        data: items.map((item) => item.total),
        backgroundColor: items.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <Box sx={{ mt: 2, height: 374, bgcolor: "background.paper" }}>
      {items.length > 0 ? (
        <Grid
          container
          spacing={2}
          sx={{
            height: "100%",
          }}>
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
              {items.map((item, index) => (
                <ListItem key={index} sx={{ p: 0 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            height: 12,
                            width: 12,
                            bgcolor: `${item.color}`,
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
        <EmptyState message="Sin gastos en el mes." />
      )}
    </Box>
  );
};
