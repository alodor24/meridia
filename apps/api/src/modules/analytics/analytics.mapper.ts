import type {
  AnalyticsMonthlyTotal,
  AnalyticsQuarterlyTotal,
  CategoryId,
  CategoryTotal,
} from "@meridia/shared";
import type {
  AvailableYearsRow,
  CategoryTotalRow,
  MonthlyTotalRow,
} from "./analytics.repository";

export interface AnalyticsTotals {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const mapCategoryTotalRow = (row: CategoryTotalRow): CategoryTotal => ({
  categoryId: row.category_id as CategoryId,
  name: row.name,
  color: row.color,
  total: row.total,
});

export const buildMonthlySeries = (
  rows: MonthlyTotalRow[],
): AnalyticsMonthlyTotal[] => {
  const byMonth = new Map(rows.map((row) => [row.month, row]));

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const row = byMonth.get(month);
    const income = row?.income ?? 0;
    const expenses = row?.expenses ?? 0;

    return {
      month,
      income,
      expenses,
      balance: income - expenses,
    };
  });
};

export const buildQuarterlySeries = (
  monthly: AnalyticsMonthlyTotal[],
): AnalyticsQuarterlyTotal[] => {
  const quarters = Array.from({ length: 4 }, (_, index) => ({
    quarter: index + 1,
    income: 0,
    expenses: 0,
  }));

  for (const item of monthly) {
    const quarter = quarters[Math.floor((item.month - 1) / 3)];
    if (!quarter) continue;

    quarter.income += item.income;
    quarter.expenses += item.expenses;
  }

  return quarters.map((quarter) => ({
    ...quarter,
    balance: quarter.income - quarter.expenses,
  }));
};

export const buildTotals = (
  monthly: AnalyticsMonthlyTotal[],
): AnalyticsTotals => {
  const totalIncome = monthly.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthly.reduce((sum, item) => sum + item.expenses, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

export const buildAvailableYears = (
  row: AvailableYearsRow,
  currentYear: number,
): { min: number; max: number } => ({
  min: Math.min(row.min_year ?? currentYear, currentYear),
  max: Math.max(row.max_year ?? currentYear, currentYear),
});
