import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SHADOW } from "@/theme/globalStyles";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import CategoryBreakdownTabs from "../components/CategoryBreakdownTabs";
import IncomeExpenseMonthlyCard from "../components/IncomeExpenseMonthlyCard";
import QuarterlyCard from "../components/QuarterlyCard";
import YearSwitcher from "../components/YearSwitcher";
import { useAnalyticsSummary } from "../hooks/useAnalyticsSummary";

const AnalyticsPage = () => {
  useDocumentTitle("Analítica");
  const { currency } = useGetUserCurrency();
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, isFetching, error, refetch } =
    useAnalyticsSummary(year);

  const availableYears = data?.availableYears ?? { min: year, max: year };
  const isEmpty =
    data !== undefined && data.totalIncome === 0 && data.totalExpenses === 0;

  return (
    <>
      <PageHeader
        title="Analítica"
        subtitle={`Ingresos, gastos y categorías de ${year}`}
        secondaryAction={
          <YearSwitcher
            year={year}
            minYear={availableYears.min}
            maxYear={availableYears.max}
            onChange={setYear}
          />
        }
      />

      {isFetching && data && <LinearProgress sx={{ mb: 2 }} />}

      {isLoading && !data && <LoadingState />}

      {error && !data && (
        <ErrorState message={error.message} onRetry={refetch} />
      )}

      {data && (
        <>
          <AnalyticsSummaryCards data={data} />

          {isEmpty ? (
            <Card sx={{ boxShadow: SHADOW }}>
              <CardContent>
                <EmptyState
                  message={`No hay movimientos registrados en ${year}.`}
                />
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <IncomeExpenseMonthlyCard
                  items={data.monthly}
                  currency={currency}
                  year={data.year}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CategoryBreakdownTabs
                  expenses={data.expensesByCategory}
                  incomes={data.incomesByCategory}
                  currency={currency}
                  year={data.year}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <QuarterlyCard
                  items={data.quarterly}
                  currency={currency}
                  year={data.year}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default AnalyticsPage;
