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

export const BALANCE_EXPRESSION = `
  (
    COALESCE((
      SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)::float8
      FROM transactions t
      WHERE t.account_id = a.id
    ), 0)
    + COALESCE((
      SELECT SUM(tr.amount)::float8
      FROM account_transfers tr
      WHERE tr.to_account_id = a.id
    ), 0)
    - COALESCE((
      SELECT SUM(tr.amount)::float8
      FROM account_transfers tr
      WHERE tr.from_account_id = a.id
    ), 0)
  )
`;

const BALANCE_SELECT = `${BALANCE_EXPRESSION} AS balance`;

export const mapAccountRow = (row: AccountRow): Account => ({
  id: row.id as AccountId,
  userId: row.user_id as UserId,
  name: row.name,
  type: row.type,
  currency: row.currency,
  balance: row.balance,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export const listByUser = async (db: Db, userId: UserId): Promise<AccountRow[]> => {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.user_id = $1
     ORDER BY a.created_at ASC`,
    [userId],
  );
  return result.rows;
};

export const findById = async (
  db: Db,
  userId: UserId,
  id: AccountId,
): Promise<AccountRow | undefined> => {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId],
  );
  return result.rows[0];
};

export const findByIds = async (
  db: Db,
  userId: UserId,
  firstId: AccountId,
  secondId: AccountId,
): Promise<AccountRow[]> => {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.user_id = $1 AND a.id IN ($2, $3)`,
    [userId, firstId, secondId],
  );
  return result.rows;
};

export const lockById = async (
  db: Db,
  userId: UserId,
  id: AccountId,
): Promise<AccountRow | undefined> => {
  const result = await db.query<AccountRow>(
    `SELECT a.*, ${BALANCE_SELECT}
     FROM accounts a
     WHERE a.id = $1 AND a.user_id = $2
     FOR UPDATE OF a`,
    [id, userId],
  );
  return result.rows[0];
};

export const lockByIds = async (
  db: Db,
  userId: UserId,
  firstId: AccountId,
  secondId: AccountId,
): Promise<AccountId[]> => {
  const result = await db.query<{ id: string }>(
    `SELECT id
     FROM accounts
     WHERE user_id = $1 AND id IN ($2, $3)
     ORDER BY id
     FOR UPDATE`,
    [userId, firstId, secondId],
  );
  return result.rows.map((row) => row.id as AccountId);
};

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateAccountInput,
): Promise<AccountRow> => {
  const result = await db.query<AccountRow>(
    `INSERT INTO accounts (user_id, name, type, currency)
     VALUES ($1, $2, $3, $4)
     RETURNING *, 0::float8 AS balance`,
    [userId, input.name, input.type, input.currency],
  );
  return result.rows[0]!;
};

export const update = async (
  db: Db,
  userId: UserId,
  id: AccountId,
  input: UpdateAccountInput,
): Promise<AccountRow | undefined> => {
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
};

export const countTransactions = async (db: Db, accountId: AccountId): Promise<number> => {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM transactions WHERE account_id = $1',
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const countTransfers = async (
  db: Db,
  accountId: AccountId,
): Promise<number> => {
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM account_transfers
     WHERE from_account_id = $1 OR to_account_id = $1`,
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const countGoals = async (
  db: Db,
  accountId: AccountId,
): Promise<number> => {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM goals WHERE account_id = $1',
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const countActiveGoals = async (
  db: Db,
  accountId: AccountId,
): Promise<number> => {
  const result = await db.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM goals WHERE account_id = $1 AND status = 'active'",
    [accountId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const remove = async (db: Db, userId: UserId, id: AccountId): Promise<boolean> => {
  const result = await db.query(
    'DELETE FROM accounts WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
};