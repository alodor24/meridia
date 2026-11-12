import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendDownIcon from "@mui/icons-material/TrendingDown";
import TrendUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatCurrency } from "@/utils/format";
import { RecentTransactions } from "../components/RecentTransactions";
import { MonthSwitcher } from "../components/MonthSwitcher";
import AnalyticsByCategory from "../components/AnalyticsByCategory";
import useAmountVisibility from "@/hooks/useAmountVisibility";
import MonthSummary from "../components/MonthSummary";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import useDashboard from "../hooks/useDashboard";

const DashboardPage = () => {
  useDocumentTitle("Dashboard");
  const { currency } = useGetUserCurrency();
  const { isVisible, toggleVisibility } = useAmountVisibility();
  const {
    anchor,
    setAnchor,
    setRange,
    month,
    isEmptyData,
    incomeComparison,
    expensesComparison,
    periodBalanceComparison,
    data,
    isLoading,
    error,
    refetch,
    monthStatCard,
  } = useDashboard();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Resumen de ${month.charAt(0).toUpperCase() + month.slice(1)}`}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {data && (
        <>
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
                icon={
                  data.periodBalance >= 0 ? <TrendUpIcon /> : <TrendDownIcon />
                }
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
      )}
    </>
  );
};

export default DashboardPage;
