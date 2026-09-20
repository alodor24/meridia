import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";
import { SHADOW } from "@/theme/globalStyles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LINE_OPTIONS } from "@/conts";
import { HorizontalRule as HorizontalRuleIcon } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface MonthSummaryItem {
  day: number;
  income: number;
  expenses: number;
  balance: number;
}

interface MonthSummaryProps {
  items: MonthSummaryItem[];
  currency: string;
}

const legends = [
  {
    title: "Ingresos",
    color: "success" as const,
  },
  {
    title: "Gastos",
    color: "error" as const,
  },
  {
    title: "Balance",
    color: "primary" as const,
  },
];

const MonthSummary = ({ items = [], currency }: MonthSummaryProps) => {
  const theme = useTheme();

  const chartData = {
    labels: items.map((item) => item.day),
    datasets: [
      {
        label: `Ingresos ${currency}`,
        data: items.map((item) => item.income),
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.main,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: theme.palette.success.main,
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
      {
        label: `Gastos ${currency}`,
        data: items.map((item) => item.expenses),
        borderColor: theme.palette.error.main,
        backgroundColor: theme.palette.error.main,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: theme.palette.error.main,
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
      {
        label: `Balance ${currency}`,
        data: items.map((item) => item.balance),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: theme.palette.primary.main,
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Resumen mensual
        </Typography>

        <Box sx={{ height: 300, bgcolor: "background.paper", pb: 4 }}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", pt: 1, pr: 2 }}>
            <List sx={{ p: 0, display: "flex", gap: 2 }}>
              {legends.map((legend, index) => (
                <ListItem key={index} disablePadding>
                  <HorizontalRuleIcon fontSize="small" color={legend.color} />
                  <Typography variant="caption">{legend.title}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          <Line data={chartData} options={LINE_OPTIONS} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthSummary;
