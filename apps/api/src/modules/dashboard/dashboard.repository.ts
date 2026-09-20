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

export interface MonthSummaryRow {
  day: number,
  income: number,
  expenses: number,
  balance: number,
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

export const getMonthSummary = async (db: Db, userId: UserId, from: string): Promise<MonthSummaryRow[]> => {
  const result = await db.query<MonthSummaryRow>(
    `
    WITH params AS (
      SELECT
        $1::UUID AS user_id,
        $2::DATE AS start_date,
        ($2::DATE + INTERVAL '1 month')::DATE AS end_date
    ),

    days AS (
      SELECT
        generate_series(
          start_date,
          end_date - INTERVAL '1 day',
          INTERVAL '1 day'
        )::DATE AS day

      FROM params
    ),

    daily_transactions AS (
      SELECT
        t.date AS day,

        COALESCE(
          SUM(t.amount) FILTER (
            WHERE t.type = 'income'
          ),
          0
        ) AS income,

        COALESCE(
          SUM(t.amount) FILTER (
            WHERE t.type = 'expense'
          ),
          0
        ) AS expenses

      FROM transactions t

      INNER JOIN params p
        ON t.user_id = p.user_id

      WHERE t.date >= p.start_date
        AND t.date < p.end_date

      GROUP BY t.date
    ),

    daily_summary AS (
      SELECT
        d.day,

        COALESCE(dt.income, 0) AS income,

        COALESCE(dt.expenses, 0) AS expenses

      FROM days d

      LEFT JOIN daily_transactions dt
        ON d.day = dt.day
    )

    SELECT
      EXTRACT(DAY FROM day)::INTEGER AS day,

      income,

      expenses,

      SUM(income - expenses) OVER (
        ORDER BY day
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS balance

    FROM daily_summary

    ORDER BY day;`, [userId, from]);
  return result.rows;
};