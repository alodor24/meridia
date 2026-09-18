import type { UserId } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface PeriodSummaryRow {
  income: number;
  expenses: number;
}

export interface CategoryTotalRow {
  category_id: string;
  name: string;
  color: string;
  total: number;
}

export const getTotalBalance = async (db: Db, userId: UserId): Promise<number> => {
  const result = await db.query<{ total: number }>(
    `SELECT COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0)::float8 AS total
     FROM transactions t
     WHERE t.user_id = $1`,
    [userId],
  );
  return result.rows[0]?.total ?? 0;
};

export const getPeriodSummary = async (
  db: Db,
  userId: UserId,
  from: string,
  to: string,
): Promise<PeriodSummaryRow> => {
  const result = await db.query<PeriodSummaryRow>(
    `SELECT
       COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)::float8 AS income,
       COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)::float8 AS expenses
     FROM transactions t
     WHERE t.user_id = $1 AND t.date BETWEEN $2 AND $3`,
    [userId, from, to],
  );
  const row = result.rows[0] ?? { income: 0, expenses: 0 };
  return { income: row.income ?? 0, expenses: row.expenses ?? 0 };
};

export const getExpensesByCategory = async (
  db: Db,
  userId: UserId,
  from: string,
  to: string,
): Promise<CategoryTotalRow[]> => {
  const result = await db.query<CategoryTotalRow>(
    `SELECT c.id AS category_id, c.name, c.color, SUM(t.amount)::float8 AS total
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.type = 'expense' AND t.date BETWEEN $2 AND $3
     GROUP BY c.id
     ORDER BY total DESC`,
    [userId, from, to],
  );
  return result.rows;
};

export const getIncomesByCategory = async (
  db: Db,
  userId: UserId,
  from: string,
  to: string,
): Promise<CategoryTotalRow[]> => {
  const result = await db.query<CategoryTotalRow>(
    `SELECT c.id AS category_id, c.name, c.color, SUM(t.amount)::float8 AS total
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.type = 'income' AND t.date BETWEEN $2 AND $3
     GROUP BY c.id
     ORDER BY total DESC`,
    [userId, from, to],
  );
  return result.rows;
};