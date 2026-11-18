import type {
  AccountId,
  CategoryId,
  TransactionType,
  UserId,
} from "@meridia/shared";
import type { Db } from "../../database/types";

export interface ReportTransactionRow {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  note: string | null;
  account_id: string;
  account_name: string;
  account_currency: string;
  category_id: string;
  category_name: string;
  category_color: string;
}

export interface ReportRepositoryFilters {
  from: string;
  to: string;
  accountId?: AccountId;
  categoryId?: CategoryId;
  type?: TransactionType;
}

export const listForReport = async (
  db: Db,
  userId: UserId,
  filters: ReportRepositoryFilters,
): Promise<ReportTransactionRow[]> => {
  const conditions = ["t.user_id = $1", "t.date >= $2", "t.date <= $3"];
  const values: unknown[] = [userId, filters.from, filters.to];

  if (filters.accountId) {
    values.push(filters.accountId);
    conditions.push(`t.account_id = $${values.length}`);
  }
  if (filters.categoryId) {
    values.push(filters.categoryId);
    conditions.push(`t.category_id = $${values.length}`);
  }
  if (filters.type) {
    values.push(filters.type);
    conditions.push(`t.type = $${values.length}`);
  }

  const result = await db.query<ReportTransactionRow>(
    `SELECT
       t.id,
       t.date,
       t.type,
       t.amount::float8 AS amount,
       t.note,
       a.id AS account_id,
       a.name AS account_name,
       a.currency AS account_currency,
       c.id AS category_id,
       c.name AS category_name,
       c.color AS category_color
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY t.date ASC, t.created_at ASC`,
    values,
  );

  return result.rows;
};
