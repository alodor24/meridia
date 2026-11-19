import { AnalyticsSummary } from "@meridia/shared";
import { useAnalyticsSummary } from "./useAnalyticsSummary";
import { getPreviousYear } from "@/utils/format";
import { calculatePctChange } from "@/utils/calculatePctChange";

const useAnalyticsSummaryCards = ({ data }: { data: AnalyticsSummary }) => {
  const prevYear = data.year - 1;

  const { data: prevData } = useAnalyticsSummary(prevYear);

  const subtitle = ` vs. Año ${getPreviousYear(data.year.toString())}`;

  const incomeComparison = calculatePctChange(
    data.totalIncome ?? 0,
    prevData?.totalIncome ?? 0,
    "income",
  );

  const expensesComparison = calculatePctChange(
    data.totalExpenses ?? 0,
    prevData?.totalExpenses ?? 0,
    "expense",
  );

  return {
    subtitle,
    incomeComparison,
    expensesComparison,
  };
};

export default useAnalyticsSummaryCards;
