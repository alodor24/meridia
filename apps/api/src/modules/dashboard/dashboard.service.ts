import { pool } from '../../database/pool';
import * as dashboardRepository from './dashboard.repository';
import * as transactionsRepository from '../transactions/transactions.repository';

export interface DashboardFilters {
  from?: string;
  to?: string;
  limit?: number;
}

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = now.toISOString().slice(0, 10);
  const from = firstDay.toISOString().slice(0, 10);
  return { from, to };
}

export async function getDashboard(userId: string, filters: DashboardFilters) {
  const { from, to } = filters.from && filters.to ? { from: filters.from, to: filters.to } : defaultRange();
  const limit = filters.limit ?? 8;

  const [totalBalance, period, expensesByCategory, lastTransactions] = await Promise.all([
    dashboardRepository.getTotalBalance(pool, userId),
    dashboardRepository.getPeriodSummary(pool, userId, from, to),
    dashboardRepository.getExpensesByCategory(pool, userId, from, to),
    transactionsRepository.list(pool, userId, { limit, offset: 0 }),
  ]);

  return {
    totalBalance,
    income: period.income,
    expenses: period.expenses,
    periodBalance: period.income - period.expenses,
    lastTransactions: lastTransactions.map(transactionsRepository.mapTransactionRow),
    expensesByCategory: expensesByCategory.map((row) => ({
      categoryId: row.category_id,
      name: row.name,
      color: row.color,
      total: row.total,
    })),
    period: { from, to },
  };
}
