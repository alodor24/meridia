import { useState } from "react";
import { Grid } from "@mui/material";
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  TrendingDown as TrendDownIcon,
  TrendingUp as TrendUpIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useAsync";
import { useAuthStore } from "@/stores/authStore";
import { formatCurrency, formatMonth, getPreviousMonth } from "@/utils/format";
import { calculatePctChange } from "@/utils/calculatePctChange";
import { subMonths } from "date-fns";
import { getDashboard } from "../services/api";
import { RecentTransactions } from "../components/RecentTransactions";
import { MonthSwitcher } from "../components/MonthSwitcher";
import { monthRangeFor } from "../utils/monthRange";
import AnalyticsByCategory from "../components/AnalyticsByCategory";
import useAmountVisibility from "../hooks/useAmountVisibility";
import MonthSummary from "../components/MonthSummary";

const DashboardPage = () => {
  useDocumentTitle("Dashboard");
  const currency = useAuthStore((s) => s.user?.currency ?? "USD");
  const [anchor, setAnchor] = useState(new Date());
  const [range, setRange] = useState(monthRangeFor(new Date()));
  const { isVisible, toggleVisibility } = useAmountVisibility();

  const month = formatMonth(anchor);
  const prevRange = monthRangeFor(subMonths(anchor, 1));

  const { data, loading, error, refetch } = useFetch(
    () => getDashboard(range),
    [range.from, range.to],
  );

  const { data: prevData } = useFetch(
    () => getDashboard(prevRange),
    [prevRange.from, prevRange.to],
  );

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <EmptyState message="No hay datos para mostrar." />;

  const monthStatCard = ` vs. ${getPreviousMonth(month)}`;

  const totalBalanceChange = calculatePctChange(
    data.totalBalance,
    prevData?.totalBalance ?? 0,
  );

  const incomeChange = calculatePctChange(data.income, prevData?.income ?? 0);

  const expensesChange = calculatePctChange(
    data.expenses,
    prevData?.expenses ?? 0,
  );

  const periodBalanceChange = calculatePctChange(
    data.periodBalance,
    prevData?.periodBalance ?? 0,
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Resumen de ${month.charAt(0).toUpperCase() + month.slice(1)}`}
      />

      <MonthSwitcher
        anchor={anchor}
        onChange={(nextRange) => {
          setAnchor(new Date(`${nextRange.from}T00:00:00`));
          setRange(nextRange);
        }}
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            main
            title="Balance total"
            value={formatCurrency(data.totalBalance, currency)}
            icon={<AccountBalanceWalletIcon />}
            color={data.totalBalance >= 0 ? "success" : "error"}
            subtitle={totalBalanceChange.label + monthStatCard}
            trend={totalBalanceChange.direction}
            amountVisibility={isVisible}
            toggleAmountVisibility={toggleVisibility}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Ingresos del mes"
            value={formatCurrency(data.income, currency)}
            icon={<TrendUpIcon />}
            color="success"
            subtitle={incomeChange.label + monthStatCard}
            trend={incomeChange.direction}
            amountVisibility={isVisible}
            toggleAmountVisibility={toggleVisibility}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Gastos del mes"
            value={formatCurrency(data.expenses, currency)}
            icon={<TrendDownIcon />}
            color="error"
            subtitle={expensesChange.label + monthStatCard}
            trend={expensesChange.direction}
            amountVisibility={isVisible}
            toggleAmountVisibility={toggleVisibility}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Balance del mes"
            value={formatCurrency(data.periodBalance, currency)}
            icon={data.periodBalance >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
            color={data.periodBalance >= 0 ? "success" : "error"}
            subtitle={periodBalanceChange.label + monthStatCard}
            trend={periodBalanceChange.direction}
            amountVisibility={isVisible}
            toggleAmountVisibility={toggleVisibility}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RecentTransactions
            transactions={data.lastTransactions}
            currency={currency}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsByCategory data={data} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <MonthSummary items={data.monthSummary} currency={currency} />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
