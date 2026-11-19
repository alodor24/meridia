import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import type { AnalyticsQuarterlyTotal } from "@meridia/shared";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { buildQuarterlyChartData } from "../utils/chartData/quarterlyChartData";
import { buildBarOptions } from "../utils/chartOptions";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface QuarterlyChartProps {
  items: AnalyticsQuarterlyTotal[];
  currency: string;
  year: number;
}

const QuarterlyChart = ({ items, currency, year }: QuarterlyChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(
    () =>
      buildQuarterlyChartData(items, {
        income: theme.palette.success.main,
        expenses: theme.palette.error.main,
        balance: theme.palette.primary.main,
      }),
    [items, theme],
  );

  const options = useMemo(
    () => buildBarOptions(currency, (index) => `T${index + 1} ${year}`),
    [currency, year],
  );

  return <Bar data={chartData} options={options} />;
};

export default QuarterlyChart;
