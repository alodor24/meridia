import { useState } from 'react';
import { Grid } from '@mui/material';
import { TrendingUp as TrendUpIcon, TrendingDown as TrendDownIcon, AccountBalanceWallet as WalletIcon, Timeline as BalanceIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useFetch } from '@/hooks/useAsync';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, formatMonth } from '@/utils/format';
import { getDashboard } from './api';
import { ExpensesByCategory } from './components/ExpensesByCategory';
import { RecentTransactions } from './components/RecentTransactions';
import { MonthSwitcher } from './components/MonthSwitcher';
import { monthRangeFor } from './monthRange';

function DashboardPage() {
  useDocumentTitle('Dashboard');
  const currency = useAuthStore((s) => s.user?.currency ?? 'USD');
  const [anchor, setAnchor] = useState(new Date());
  const [range, setRange] = useState(monthRangeFor(new Date()));

  const { data, loading, error, refetch } = useFetch(
    () => getDashboard(range),
    [range.from, range.to],
  );

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <EmptyState message="No hay datos para mostrar." />;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Resumen de ${formatMonth(anchor)}`} />
      <MonthSwitcher
        anchor={anchor}
        onChange={(nextRange) => {
          setAnchor(new Date(`${nextRange.from}T00:00:00`));
          setRange(nextRange);
        }}
      />

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Balance total" value={formatCurrency(data.totalBalance, currency)} icon={<WalletIcon />} color={data.totalBalance >= 0 ? 'success' : 'error'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Ingresos del período" value={formatCurrency(data.income, currency)} icon={<TrendUpIcon />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Gastos del período" value={formatCurrency(data.expenses, currency)} icon={<TrendDownIcon />} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Balance del período" value={formatCurrency(data.periodBalance, currency)} icon={<BalanceIcon />} color={data.periodBalance >= 0 ? 'success' : 'error'} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentTransactions transactions={data.lastTransactions} currency={currency} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpensesByCategory items={data.expensesByCategory} currency={currency} />
        </Grid>
      </Grid>
    </>
  );
}

export default DashboardPage;
