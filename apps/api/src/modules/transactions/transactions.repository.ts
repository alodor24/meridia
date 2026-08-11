import type { Transaction, TransactionType } from '@meridia/shared';
import type { Db } from '../../database/types';
import type { ListTransactionsQuery } from './transactions.schemas';

export interface TransactionRow {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount: string;
  date: string;
  note: string | null;
  created_at: Date;
  updated_at: Date;
  account_name?: string;
  category_name?: string;
  category_color?: string;
}

export interface CreateTransactionInput {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}

export interface UpdateTransactionInput {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  date?: string;
  note?: string;
}

export function mapTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    categoryId: row.category_id,
    type: row.type,
    amount: Number(row.amount),
    date: row.date,
    note: row.note,
    accountName: row.account_name,
    categoryName: row.category_name,
    categoryColor: row.category_color,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const TRANSACTION_COLUMNS = `
  t.id, t.user_id, t.account_id, t.category_id, t.type,
  t.amount::float8 AS amount, t.date, t.note,
  t.created_at, t.updated_at,
  a.name AS account_name,
  c.name AS category_name,
  c.color AS category_color
`;

export async function list(
  db: Db,
  userId: string,
  filters: ListTransactionsQuery,
): Promise<TransactionRow[]> {
  const { where, values } = buildWhere(userId, filters);
  const result = await db.query<TransactionRow>(
    `SELECT ${TRANSACTION_COLUMNS}
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id
     ${where}
     ORDER BY t.date DESC, t.created_at DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, filters.limit, filters.offset],
  );
  return result.rows;
}

export async function count(
  db: Db,
  userId: string,
  filters: ListTransactionsQuery,
): Promise<number> {
  const { where, values } = buildWhere(userId, filters);
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id
     ${where}`,
    values,
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function findById(
  db: Db,
  userId: string,
  id: string,
): Promise<TransactionRow | undefined> {
  const result = await db.query<TransactionRow>(
    `SELECT ${TRANSACTION_COLUMNS}
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id
     WHERE t.id = $1 AND t.user_id = $2`,
    [id, userId],
  );
  return result.rows[0];
}

export async function create(
  db: Db,
  userId: string,
  input: CreateTransactionInput,
): Promise<TransactionRow> {
  const result = await db.query<TransactionRow>(
    `WITH ins AS (
       INSERT INTO transactions (user_id, account_id, category_id, type, amount, date, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *
     )
     SELECT ${TRANSACTION_COLUMNS}
     FROM ins t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id`,
    [userId, input.accountId, input.categoryId, input.type, input.amount, input.date, input.note ?? null],
  );
  return result.rows[0]!;
}

export async function update(
  db: Db,
  userId: string,
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionRow | undefined> {
  const fields: string[] = [];
  const values: unknown[] = [id, userId];
  const set = (column: string, value: unknown) => {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  };
  if (input.accountId !== undefined) set('account_id', input.accountId);
  if (input.categoryId !== undefined) set('category_id', input.categoryId);
  if (input.type !== undefined) set('type', input.type);
  if (input.amount !== undefined) set('amount', input.amount);
  if (input.date !== undefined) set('date', input.date);
  if (input.note !== undefined) set('note', input.note === '' ? null : input.note);
  if (fields.length === 0) return undefined;

  const result = await db.query<TransactionRow>(
    `WITH upd AS (
       UPDATE transactions SET ${fields.join(', ')}
       WHERE id = $1 AND user_id = $2
       RETURNING *
     )
     SELECT ${TRANSACTION_COLUMNS}
     FROM upd t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id`,
    values,
  );
  return result.rows[0];
}

export async function remove(db: Db, userId: string, id: string): Promise<boolean> {
  const result = await db.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
}

function buildWhere(userId: string, filters: ListTransactionsQuery) {
  const conditions = ['t.user_id = $1'];
  const values: unknown[] = [userId];
  if (filters.from) {
    values.push(filters.from);
    conditions.push(`t.date >= $${values.length}`);
  }
  if (filters.to) {
    values.push(filters.to);
    conditions.push(`t.date <= $${values.length}`);
  }
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
  return { where: `WHERE ${conditions.join(' AND ')}`, values };
}
