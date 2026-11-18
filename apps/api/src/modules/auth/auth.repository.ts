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

export interface EmailVerificationTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface CreateEmailVerificationTokenInput {
  userId: UserId;
  tokenHash: string;
  expiresAt: Date;
}

export interface PasswordResetTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface CreatePasswordResetTokenInput {
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
    avatar: string | null;
    avatar_public_id: string | null;
    email_verified_at: Date | null;
    user_created_at: Date;
    user_updated_at: Date;
  }>(
    `SELECT rt.id AS refresh_token_id, rt.user_id, rt.token_hash, rt.expires_at, rt.revoked_at, rt.created_at,
            u.id, u.email, u.password_hash, u.name, u.country, u.currency, u.avatar, u.avatar_public_id,
            u.email_verified_at,
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
      avatar: row.avatar,
      avatar_public_id: row.avatar_public_id,
      email_verified_at: row.email_verified_at,
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

export const deleteRefreshTokenById = async (
  db: Db,
  id: string,
): Promise<boolean> => {
  const result = await db.query(
    `
      DELETE FROM refresh_tokens
      WHERE id = $1
        AND revoked_at IS NULL
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

export const revokeAllRefreshTokensByUser = async (
  db: Db,
  userId: UserId,
): Promise<void> => {
  await db.query(
    `UPDATE refresh_tokens
     SET revoked_at = now()
     WHERE user_id = $1
       AND revoked_at IS NULL`,
    [userId],
  );
};

export const createEmailVerificationToken = async (
  db: Db,
  input: CreateEmailVerificationTokenInput,
): Promise<EmailVerificationTokenRow> => {
  const result = await db.query<EmailVerificationTokenRow>(
    `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [input.userId, input.tokenHash, input.expiresAt],
  );
  return result.rows[0]!;
};

export const deleteUnusedEmailVerificationTokens = async (
  db: Db,
  userId: UserId,
): Promise<void> => {
  await db.query(
    `DELETE FROM email_verification_tokens
     WHERE user_id = $1
       AND used_at IS NULL`,
    [userId],
  );
};

export const findLatestEmailVerificationToken = async (
  db: Db,
  userId: UserId,
): Promise<EmailVerificationTokenRow | undefined> => {
  const result = await db.query<EmailVerificationTokenRow>(
    `SELECT *
     FROM email_verification_tokens
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  );
  return result.rows[0];
};

export const consumeEmailVerificationToken = async (
  db: Db,
  tokenHash: string,
): Promise<UserId | undefined> => {
  const result = await db.query<{ user_id: string }>(
    `UPDATE email_verification_tokens
     SET used_at = now()
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > now()
     RETURNING user_id`,
    [tokenHash],
  );

  const row = result.rows[0];
  return row ? (row.user_id as UserId) : undefined;
};

export const createPasswordResetToken = async (
  db: Db,
  input: CreatePasswordResetTokenInput,
): Promise<PasswordResetTokenRow> => {
  const result = await db.query<PasswordResetTokenRow>(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [input.userId, input.tokenHash, input.expiresAt],
  );
  return result.rows[0]!;
};

export const deleteUnusedPasswordResetTokens = async (
  db: Db,
  userId: UserId,
): Promise<void> => {
  await db.query(
    `DELETE FROM password_reset_tokens
     WHERE user_id = $1
       AND used_at IS NULL`,
    [userId],
  );
};

export const findLatestPasswordResetToken = async (
  db: Db,
  userId: UserId,
): Promise<PasswordResetTokenRow | undefined> => {
  const result = await db.query<PasswordResetTokenRow>(
    `SELECT *
     FROM password_reset_tokens
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  );
  return result.rows[0];
};

export const consumePasswordResetToken = async (
  db: Db,
  tokenHash: string,
): Promise<UserId | undefined> => {
  const result = await db.query<{ user_id: string }>(
    `UPDATE password_reset_tokens
     SET used_at = now()
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > now()
     RETURNING user_id`,
    [tokenHash],
  );

  const row = result.rows[0];
  return row ? (row.user_id as UserId) : undefined;
};

const DEFAULT_CATEGORIES: Array<{ name: string; type: 'income' | 'expense'; color: string; icon?: string }> = [
  { name: 'Salario', type: 'income', color: '#2e7d32', icon: "MonetizationOn" },
  { name: 'Negocios', type: 'income', color: '#43a047', icon: "BusinessCenter" },
  { name: 'Inversiones', type: 'income', color: '#66bb6a', icon: "TrendingUp" },
  { name: 'Otros ingresos', type: 'income', color: '#81c784', icon: "Savings" },
  { name: 'Vivienda', type: 'expense', color: '#d32f2f', icon: "Home" },
  { name: 'Alimentación', type: 'expense', color: '#f57c00', icon: "LocalGroceryStore" },
  { name: 'Transporte', type: 'expense', color: '#0288d1', icon: "DirectionsBus" },
  { name: 'Salud', type: 'expense', color: '#7b1fa2', icon: "LocalHospital" },
  { name: 'Ocio', type: 'expense', color: '#f06292', icon: "Fastfood" },
  { name: 'Educación', type: 'expense', color: '#3949ab', icon: "School" },
  { name: 'Servicios', type: 'expense', color: '#00838f', icon: "EmojiObjects" },
  { name: 'Otros gastos', type: 'expense', color: '#757575', icon: "Handyman" },
];

export const createDefaultCategories = async (db: Db, userId: UserId): Promise<void> => {
  const values: unknown[] = [];
  const placeholders: string[] = [];

  DEFAULT_CATEGORIES.forEach((category, index) => {
    const base = index * 5;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`);
    values.push(userId, category.name, category.type, category.color, category.icon);
  });

  await db.query(
    `INSERT INTO categories (user_id, name, type, color, icon)
     VALUES ${placeholders.join(', ')}`,
    values,
  );
};

export const mapUserFromTokenRow = (row: RefreshTokenWithUser): User =>
  mapUserRow(row.user);