import { useState } from "react";
import { monthRangeFor } from "../utils/monthRange";
import { formatMonth, getPreviousMonth } from "@/utils/format";
import { subMonths } from "date-fns";
import { useDashboardSummary } from "./useDashboardSummary";
import { calculatePctChange } from "@/utils/calculatePctChange";

const useDashboard = () => {
  const [anchor, setAnchor] = useState(new Date());
  const [range, setRange] = useState(monthRangeFor(new Date()));

  const month = formatMonth(anchor);
  const prevRange = monthRangeFor(subMonths(anchor, 1));

  const { data, isLoading, error, refetch } = useDashboardSummary(range);
  const { data: prevData } = useDashboardSummary(prevRange);

  const monthStatCard = ` vs. ${getPreviousMonth(month)}`;
  const isEmptyData =
    data?.income === 0 && data?.expenses === 0 && data?.periodBalance === 0;

  const incomeComparison = calculatePctChange(
    data?.income ?? 0,
    prevData?.income ?? 0,
    "income",
  );

  const expensesComparison = calculatePctChange(
    data?.expenses ?? 0,
    prevData?.expenses ?? 0,
    "expense",
  );

  const periodBalanceComparison = calculatePctChange(
    data?.periodBalance ?? 0,
    prevData?.periodBalance ?? 0,
    "balance",
  );

  return {
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
  };
};

export default useDashboard;
