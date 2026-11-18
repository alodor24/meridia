import type {
  AccountId,
  AccountTransfer,
  TransferId,
  UserId,
} from '@meridia/shared';
import type { Db } from '../../database/types';
import type { ListTransfersQuery } from './transfers.schemas';

export interface TransferRow {
  id: string;
  user_id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  note: string | null;
  created_at: Date;
  from_account_name: string;
  to_account_name: string;
  currency: string;
}

export interface CreateTransferData {
  fromAccountId: AccountId;
  toAccountId: AccountId;
  amount: number;
  note: string | null;
}

const TRANSFER_COLUMNS = `
  tr.id, tr.user_id, tr.from_account_id, tr.to_account_id,
  tr.amount::float8 AS amount, tr.note, tr.created_at,
  src.name AS from_account_name,
  dst.name AS to_account_name,
  src.currency AS currency
`;

export const mapTransferRow = (row: TransferRow): AccountTransfer => ({
  id: row.id as TransferId,
  userId: row.user_id as UserId,
  fromAccountId: row.from_account_id as AccountId,
  toAccountId: row.to_account_id as AccountId,
  fromAccountName: row.from_account_name,
  toAccountName: row.to_account_name,
  currency: row.currency,
  amount: Number(row.amount),
  note: row.note,
  createdAt: row.created_at.toISOString(),
});

export const list = async (
  db: Db,
  userId: UserId,
  filters: ListTransfersQuery,
): Promise<TransferRow[]> => {
  const result = await db.query<TransferRow>(
    `SELECT ${TRANSFER_COLUMNS}
     FROM account_transfers tr
     JOIN accounts src ON src.id = tr.from_account_id
     JOIN accounts dst ON dst.id = tr.to_account_id
     WHERE tr.user_id = $1
     ORDER BY tr.created_at DESC, tr.id DESC
     LIMIT $2 OFFSET $3`,
    [userId, filters.limit, filters.offset],
  );
  return result.rows;
};

export const count = async (db: Db, userId: UserId): Promise<number> => {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM account_transfers WHERE user_id = $1',
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const findById = async (
  db: Db,
  userId: UserId,
  id: TransferId,
): Promise<TransferRow | undefined> => {
  const result = await db.query<TransferRow>(
    `SELECT ${TRANSFER_COLUMNS}
     FROM account_transfers tr
     JOIN accounts src ON src.id = tr.from_account_id
     JOIN accounts dst ON dst.id = tr.to_account_id
     WHERE tr.id = $1 AND tr.user_id = $2`,
    [id, userId],
  );
  return result.rows[0];
};

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateTransferData,
): Promise<TransferRow> => {
  const result = await db.query<TransferRow>(
    `WITH ins AS (
       INSERT INTO account_transfers (user_id, from_account_id, to_account_id, amount, note)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *
     )
     SELECT ${TRANSFER_COLUMNS}
     FROM ins tr
     JOIN accounts src ON src.id = tr.from_account_id
     JOIN accounts dst ON dst.id = tr.to_account_id`,
    [userId, input.fromAccountId, input.toAccountId, input.amount, input.note],
  );
  return result.rows[0]!;
};

export const remove = async (
  db: Db,
  userId: UserId,
  id: TransferId,
): Promise<boolean> => {
  const result = await db.query(
    'DELETE FROM account_transfers WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
};
