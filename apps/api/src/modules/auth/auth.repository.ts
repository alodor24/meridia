import type { User, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';
import type { UserRow } from '../users/users.repository';
import { mapUserRow } from '../users/users.repository';

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export interface RefreshTokenWithUser extends RefreshTokenRow {
  user: UserRow;
}

export interface CreateRefreshTokenInput {
  userId: UserId;
  tokenHash: string;
  expiresAt: Date;
}

export const createRefreshToken = async (
  db: Db,
  input: CreateRefreshTokenInput,
): Promise<RefreshTokenRow> => {
  const result = await db.query<RefreshTokenRow>(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [input.userId, input.tokenHash, input.expiresAt],
  );
  return result.rows[0]!;
};

export const findValidRefreshToken = async (
  db: Db,
  tokenHash: string,
): Promise<RefreshTokenWithUser | undefined> => {
  const result = await db.query<{
    refresh_token_id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    revoked_at: Date | null;
    created_at: Date;
    id: string;
    email: string;
    password_hash: string;
    name: string;
    country: string;
    currency: string;
    user_created_at: Date;
    user_updated_at: Date;
  }>(
    `SELECT rt.id AS refresh_token_id, rt.user_id, rt.token_hash, rt.expires_at, rt.revoked_at, rt.created_at,
            u.id, u.email, u.password_hash, u.name, u.country, u.currency,
            u.created_at AS user_created_at, u.updated_at AS user_updated_at
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1
       AND rt.revoked_at IS NULL
       AND rt.expires_at > now()`,
    [tokenHash],
  );

  const row = result.rows[0];
  if (!row) return undefined;

  return {
    id: row.refresh_token_id,
    user_id: row.user_id,
    token_hash: row.token_hash,
    expires_at: row.expires_at,
    revoked_at: row.revoked_at,
    created_at: row.created_at,
    user: {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      name: row.name,
      country: row.country,
      currency: row.currency,
      created_at: row.user_created_at,
      updated_at: row.user_updated_at,
    },
  };
};

export const revokeRefreshToken = async (
  db: Db,
  tokenHash: string,
): Promise<void> => {
  await db.query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1',
    [tokenHash],
  );
};

export const revokeRefreshTokenById = async (
  db: Db,
  id: string,
): Promise<boolean> => {
  const result = await db.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = now()
      WHERE id = $1
        AND revoked_at IS NULL
      RETURNING id
    `,
    [id],
  );

  return result.rowCount === 1;
};

export const deleteExpiredRefreshTokensByUser = async (
  db: Db,
  userId: UserId,
): Promise<void> => {
  await db.query(
    `
      DELETE FROM refresh_tokens
      WHERE user_id = $1
        AND expires_at <= now()
    `,
    [userId],
  );
};

const DEFAULT_CATEGORIES: Array<{ name: string; type: 'income' | 'expense'; color: string }> = [
  { name: 'Salario', type: 'income', color: '#2e7d32' },
  { name: 'Negocios', type: 'income', color: '#43a047' },
  { name: 'Inversiones', type: 'income', color: '#66bb6a' },
  { name: 'Otros ingresos', type: 'income', color: '#81c784' },
  { name: 'Vivienda', type: 'expense', color: '#d32f2f' },
  { name: 'Alimentación', type: 'expense', color: '#f57c00' },
  { name: 'Transporte', type: 'expense', color: '#0288d1' },
  { name: 'Salud', type: 'expense', color: '#7b1fa2' },
  { name: 'Ocio', type: 'expense', color: '#f06292' },
  { name: 'Educación', type: 'expense', color: '#3949ab' },
  { name: 'Servicios', type: 'expense', color: '#00838f' },
  { name: 'Otros gastos', type: 'expense', color: '#757575' },
];

export const createDefaultCategories = async (db: Db, userId: UserId): Promise<void> => {
  const values: unknown[] = [];
  const placeholders: string[] = [];

  DEFAULT_CATEGORIES.forEach((category, index) => {
    const base = index * 4;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
    values.push(userId, category.name, category.type, category.color);
  });

  await db.query(
    `INSERT INTO categories (user_id, name, type, color)
     VALUES ${placeholders.join(', ')}`,
    values,
  );
};

export const mapUserFromTokenRow = (row: RefreshTokenWithUser): User =>
  mapUserRow(row.user);