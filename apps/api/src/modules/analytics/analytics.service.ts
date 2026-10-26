import type { AnalyticsSummary, UserId } from "@meridia/shared";
import { pool } from "../../database/pool";
import * as analyticsRepository from "./analytics.repository";
import {
  buildAvailableYears,
  buildMonthlySeries,
  buildQuarterlySeries,
  buildTotals,
  mapCategoryTotalRow,
} from "./analytics.mapper";

const yearRange = (year: number): { from: string; to: string } => ({
  from: `${year}-01-01`,
  to: `${year}-12-31`,
});

export const getAnalytics = async (
  userId: UserId,
  year: number,
): Promise<AnalyticsSummary> => {
  const { from, to } = yearRange(year);

  const [monthlyRows, expenseRows, incomeRows, availableYearsRow] =
    await Promise.all([
      analyticsRepository.getMonthlyTotals(pool, userId, from, to),
      analyticsRepository.getCategoryTotals(pool, userId, "expense", from, to),
      analyticsRepository.getCategoryTotals(pool, userId, "income", from, to),
      analyticsRepository.getAvailableYears(pool, userId),
    ]);

  const monthly = buildMonthlySeries(monthlyRows);
  const totals = buildTotals(monthly);

  return {
    year,
    ...totals,
    monthly,
    quarterly: buildQuarterlySeries(monthly),
    expensesByCategory: expenseRows.map(mapCategoryTotalRow),
    incomesByCategory: incomeRows.map(mapCategoryTotalRow),
    availableYears: buildAvailableYears(
      availableYearsRow,
      new Date().getFullYear(),
    ),
  };
};
