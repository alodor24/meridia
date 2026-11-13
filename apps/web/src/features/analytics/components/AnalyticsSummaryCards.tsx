import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Grid from "@mui/material/Grid";
import type { AnalyticsSummary } from "@meridia/shared";
import { StatCard } from "@/components/ui/StatCard";
import useAmountVisibility from "@/hooks/useAmountVisibility";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import { formatCurrency } from "@/utils/format";

interface AnalyticsSummaryCardsProps {
  data: AnalyticsSummary;
}

const AnalyticsSummaryCards = ({ data }: AnalyticsSummaryCardsProps) => {
  const { currency } = useGetUserCurrency();
  const { isVisible, toggleVisibility } = useAmountVisibility();
  const subtitle = `Año ${data.year}`;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Ingresos totales del año"
          value={formatCurrency(data.totalIncome, currency)}
          icon={<TrendingUpIcon />}
          color="success"
          subtitle={subtitle}
          amountVisibility={isVisible}
          toggleAmountVisibility={toggleVisibility}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Gastos totales del año"
          value={formatCurrency(data.totalExpenses, currency)}
          icon={<TrendingDownIcon />}
          color="error"
          subtitle={subtitle}
          amountVisibility={isVisible}
          toggleAmountVisibility={toggleVisibility}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Balance anual"
          value={formatCurrency(data.balance, currency)}
          icon={data.balance >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
          color={data.balance >= 0 ? "success" : "error"}
          subtitle={subtitle}
          amountVisibility={isVisible}
          toggleAmountVisibility={toggleVisibility}
        />
      </Grid>
    </Grid>
  );
};

export default AnalyticsSummaryCards;
