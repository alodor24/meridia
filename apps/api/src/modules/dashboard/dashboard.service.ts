import { pool } from '../../database/pool';
import * as dashboardRepository from './dashboard.repository';
import * as transactionsRepository from '../transactions/transactions.repository';
import type { CategoryId, UserId } from '@meridia/shared';

export interface DashboardFilters {
  from?: string;
  to?: string;
  limit?: number;
}

const defaultRange = (): { from: string; to: string } => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = now.toISOString().slice(0, 10);
  const from = firstDay.toISOString().slice(0, 10);
  return { from, to };
};

export const getDashboard = async (userId: UserId, filters: DashboardFilters) => {
  const { from, to } = filters.from && filters.to ? { from: filters.from, to: filters.to } : defaultRange();
  const limit = filters.limit ?? 8;

  const [totalBalance, period, expensesByCategory, incomesByCategory, monthSummary, lastTransactions] = await Promise.all([
    dashboardRepository.getTotalBalance(pool, userId),
    dashboardRepository.getPeriodSummary(pool, userId, from, to),
    dashboardRepository.getExpensesByCategory(pool, userId, from, to),
    dashboardRepository.getIncomesByCategory(pool, userId, from, to),
    dashboardRepository.getMonthSummary(pool, userId, from),
    transactionsRepository.list(pool, userId, { limit, offset: 0 }),
  ]);

  return {
    totalBalance,
    income: period.income,
    expenses: period.expenses,
    periodBalance: period.income - period.expenses,
    lastTransactions: lastTransactions.map(transactionsRepository.mapTransactionRow),
    expensesByCategory: expensesByCategory.map((row) => ({
      categoryId: row.category_id as CategoryId,
      name: row.name,
      color: row.color,
      total: row.total,
    })),
    incomesByCategory: incomesByCategory.map((row) => ({
      categoryId: row.category_id as CategoryId,
      name: row.name,
      color: row.color,
      total: row.total,
    })),
    monthSummary: monthSummary.map((row) => ({
      day: row.day,
      income: row.income,
      expenses: row.expenses,
      balance: row.balance,
    })),
    period: { from, to },
  };
};