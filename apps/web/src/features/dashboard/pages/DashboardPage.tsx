import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendDownIcon from "@mui/icons-material/TrendingDown";
import TrendUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatCurrency, formatMonth, getPreviousMonth } from "@/utils/format";
import { calculatePctChange } from "@/utils/calculatePctChange";
import { subMonths } from "date-fns";
import { RecentTransactions } from "../components/RecentTransactions";
import { MonthSwitcher } from "../components/MonthSwitcher";
import { monthRangeFor } from "../utils/monthRange";
import AnalyticsByCategory from "../components/AnalyticsByCategory";
import useAmountVisibility from "@/hooks/useAmountVisibility";
import MonthSummary from "../components/MonthSummary";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

const DashboardPage = () => {
  useDocumentTitle("Dashboard");
  const { currency } = useGetUserCurrency();
  const [anchor, setAnchor] = useState(new Date());
  const [range, setRange] = useState(monthRangeFor(new Date()));
  const { isVisible, toggleVisibility } = useAmountVisibility();

  const month = formatMonth(anchor);
  const prevRange = monthRangeFor(subMonths(anchor, 1));

  const { data, isLoading, error, refetch } = useDashboardSummary(range);
  const { data: prevData } = useDashboardSummary(prevRange);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!data) return <EmptyState message="No hay datos para mostrar." />;

  const monthStatCard = ` vs. ${getPreviousMonth(month)}`;
  const isEmptyData =
    data.income === 0 && data.expenses === 0 && data.periodBalance === 0;

  const incomeComparison = calculatePctChange(
    data.income,
    prevData?.income ?? 0,
    "income",
  );

  const expensesComparison = calculatePctChange(
    data.expenses,
    prevData?.expenses ?? 0,
    "expense",
  );

  const periodBalanceComparison = calculatePctChange(
    data.periodBalance,
    prevData?.periodBalance ?? 0,
    "balance",
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

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            main
            title="Balance total"
            value={formatCurrency(data.totalBalance, currency)}
            icon={<AccountBalanceWalletIcon />}
            color={data.totalBalance >= 0 ? "success" : "error"}
            subtitle={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccountBalanceIcon sx={{ fontSize: 14 }} />
                {"Saldo acumulado de todas las cuentas"}
              </Box>
            }
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
            subtitle={monthStatCard}
            comparison={incomeComparison}
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
            subtitle={monthStatCard}
            comparison={expensesComparison}
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
            subtitle={monthStatCard}
            comparison={periodBalanceComparison}
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
          <MonthSummary
            items={data.monthSummary}
            currency={currency}
            isEmptyData={isEmptyData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
