import { useState } from "react";
import Grid from "@mui/material/Grid";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import useGetUserCurrency from "@/hooks/useGetUserCurrency";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
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

  const { data, isLoading, error, refetch } = useAnalyticsSummary(year);

  const isEmpty =
    data != null && data.totalIncome === 0 && data.totalExpenses === 0;

  return (
    <>
      <PageHeader
        title="Analítica"
        subtitle="Consulta y analiza la evolución de tus finanzas."
        secondaryAction={<YearSwitcher year={year} onChange={setYear} />}
      />

      {isLoading && <LoadingState />}

      {!isLoading && error && (
        <ErrorState message={error.message} onRetry={refetch} />
      )}

      {data && (
        <>
          <AnalyticsSummaryCards data={data} />

          {!isEmpty ? (
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
          ) : (
            <EmptyState
              message={`No hay movimientos registrados en ${year}.`}
            />
          )}
        </>
      )}
    </>
  );
};

export default AnalyticsPage;
