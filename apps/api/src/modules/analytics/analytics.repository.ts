import type { TransactionType, UserId } from "@meridia/shared";
import type { Db } from "../../database/types";

export interface MonthlyTotalRow {
  month: number;
  income: number;
  expenses: number;
}

export interface CategoryTotalRow {
  category_id: string;
  name: string;
  color: string;
  total: number;
}

export interface AvailableYearsRow {
  min_year: number | null;
  max_year: number | null;
}

export const getMonthlyTotals = async (
  db: Db,
  userId: UserId,
  from: string,
  to: string,
): Promise<MonthlyTotalRow[]> => {
  const result = await db.query<MonthlyTotalRow>(
    `SELECT
       EXTRACT(MONTH FROM t.date)::int AS month,
       COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'), 0)::float8 AS income,
       COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0)::float8 AS expenses
     FROM transactions t
     WHERE t.user_id = $1 AND t.date BETWEEN $2 AND $3
     GROUP BY 1
     ORDER BY 1`,
    [userId, from, to],
  );
  return result.rows;
};

export const getCategoryTotals = async (
  db: Db,
  userId: UserId,
  type: TransactionType,
  from: string,
  to: string,
): Promise<CategoryTotalRow[]> => {
  const result = await db.query<CategoryTotalRow>(
    `SELECT c.id AS category_id, c.name, c.color, SUM(t.amount)::float8 AS total
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.type = $2 AND t.date BETWEEN $3 AND $4
     GROUP BY c.id, c.name, c.color
     ORDER BY total DESC`,
    [userId, type, from, to],
  );
  return result.rows;
};

export const getAvailableYears = async (
  db: Db,
  userId: UserId,
): Promise<AvailableYearsRow> => {
  const result = await db.query<AvailableYearsRow>(
    `SELECT
       EXTRACT(YEAR FROM MIN(t.date))::int AS min_year,
       EXTRACT(YEAR FROM MAX(t.date))::int AS max_year
     FROM transactions t
     WHERE t.user_id = $1`,
    [userId],
  );
  return result.rows[0] ?? { min_year: null, max_year: null };
};
