import type { Account, AccountId, AccountType, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface AccountRow {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  currency: string;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  currency?: string;
}

const BALANCE_SELECT = `
  COALESCE((
    SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)::float8
    FROM transactions t
    WHERE t.account_id = a.id
  ), 0) AS balance
`;

export function mapAccountRow(row: AccountRow): Account {
  return {
    id: row.id as AccountId,
    userId: row.user_id as UserId,
    name: row.name,
    type: row.type,
    currency: row.currency,
    balance: row.balance,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listByUser(db: Db, userId: UserId): Promise<AccountRow[]> {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.user_id = $1
     ORDER BY a.created_at ASC`,
    [userId],
  );
  return result.rows;
}

export async function findById(db: Db, userId: UserId, id: AccountId): Promise<AccountRow | undefined> {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId],
  );
  return result.rows[0];
}

export async function create(db: Db, userId: UserId, input: CreateAccountInput): Promise<AccountRow> {
  const result = await db.query<AccountRow>(
    `INSERT INTO accounts (user_id, name, type, currency)
     VALUES ($1, $2, $3, $4)
     RETURNING *, 0::float8 AS balance`,
    [userId, input.name, input.type, input.currency],
  );
  return result.rows[0]!;
}

export async function update(
  db: Db,
  userId: UserId,
  id: AccountId,
  input: UpdateAccountInput,
): Promise<AccountRow | undefined> {
  const fields: string[] = [];
  const values: unknown[] = [id, userId];
  if (input.name !== undefined) {
    values.push(input.name);
    fields.push(`name = $${values.length}`);
  }
  if (input.type !== undefined) {
    values.push(input.type);
    fields.push(`type = $${values.length}`);
  }
  if (input.currency !== undefined) {
    values.push(input.currency);
    fields.push(`currency = $${values.length}`);
  }
  if (fields.length === 0) return undefined;

  const result = await db.query<AccountRow>(
    `UPDATE accounts a SET ${fields.join(', ')}
     WHERE a.id = $1 AND a.user_id = $2
     RETURNING a.*, ${BALANCE_SELECT}`,
    values,
  );
  return result.rows[0];
}

export async function countTransactions(db: Db, accountId: AccountId): Promise<number> {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM transactions WHERE account_id = $1',
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function remove(db: Db, userId: UserId, id: AccountId): Promise<boolean> {
  const result = await db.query(
    'DELETE FROM accounts WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
}
