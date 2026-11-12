import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type Chart,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SHADOW } from "@/theme/globalStyles";
import { LINE_OPTIONS } from "@/consts";
import { EmptyState } from "@/components/ui/States";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
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
  isEmptyData: boolean;
}

const legends = [
  { title: "Ingresos", color: "success" },
  { title: "Gastos", color: "error" },
  { title: "Balance", color: "primary" },
] as const;

const createGradient = (context: ScriptableContext<"line">, color: string) => {
  const { ctx, chartArea } = context.chart;

  if (!chartArea) return color;

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );

  gradient.addColorStop(0, `${color}80`);
  gradient.addColorStop(1, `${color}00`);

  return gradient;
};

const MonthSummary = ({
  items = [],
  currency,
  isEmptyData,
}: MonthSummaryProps) => {
  const theme = useTheme();
  const chartRef = useRef<Chart<"line"> | null>(null);

  const chartData = useMemo<ChartData<"line">>(() => {
    const colors = {
      income: theme.palette.success.main,
      expenses: theme.palette.error.main,
      balance: theme.palette.primary.main,
    };

    const createDataset = (
      label: string,
      data: number[],
      color: string,
      fill = true,
    ) => ({
      label: `${label} ${currency}`,
      data,
      borderColor: color,
      backgroundColor: (context: ScriptableContext<"line">) =>
        createGradient(context, color),
      pointBackgroundColor: theme.palette.background.paper,
      pointBorderColor: color,
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.35,
      fill,
    });

    return {
      labels: items.map((item) => item.day),
      datasets: [
        createDataset(
          "Ingresos",
          items.map((item) => item.income),
          colors.income,
        ),
        createDataset(
          "Gastos",
          items.map((item) => item.expenses),
          colors.expenses,
        ),
        createDataset(
          "Balance",
          items.map((item) => item.balance),
          colors.balance,
        ),
      ],
    };
  }, [items, currency, theme]);

  return (
    <Card sx={{ height: "100%", boxShadow: SHADOW }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Resumen mensual
        </Typography>

        <Box
          sx={{
            height: 300,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}>
          {!isEmptyData ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pt: 1,
                  pr: 2,
                  flexShrink: 0,
                }}>
                <List sx={{ p: 0, display: "flex", gap: 2 }}>
                  {legends.map((legend) => (
                    <ListItem key={legend.title} disablePadding>
                      <HorizontalRuleIcon
                        fontSize="small"
                        color={legend.color}
                      />
                      <Typography variant="caption">{legend.title}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
                <Line
                  ref={chartRef}
                  data={chartData}
                  options={LINE_OPTIONS as ChartOptions<"line">}
                />
              </Box>
            </>
          ) : (
            <EmptyState message="No hay datos para mostrar." />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthSummary;
