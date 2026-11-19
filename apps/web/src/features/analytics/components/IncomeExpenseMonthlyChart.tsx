import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import type { AnalyticsMonthlyTotal } from "@meridia/shared";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { buildMonthlyChartData } from "../utils/chartData/monthlyChartData";
import { buildBarOptions } from "../utils/chartOptions";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IncomeExpenseMonthlyChartProps {
  items: AnalyticsMonthlyTotal[];
  currency: string;
}

const IncomeExpenseMonthlyChart = ({
  items,
  currency,
}: IncomeExpenseMonthlyChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(
    () =>
      buildMonthlyChartData(items, {
        income: theme.palette.success.main,
        expenses: theme.palette.error.main,
        balance: theme.palette.primary.main,
      }),
    [items, theme],
  );

  const options = useMemo(() => buildBarOptions(currency), [currency]);

  return <Bar data={chartData} options={options} />;
};

export default IncomeExpenseMonthlyChart;
