import type { User, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  country: string;
  currency: string;
  avatar: string | null;
  avatar_public_id: string | null;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const mapUserRow = (row: UserRow): User => ({
  id: row.id as UserId,
  email: row.email,
  name: row.name,
  country: row.country,
  currency: row.currency,
  avatar: row.avatar,
  avatarPublicId: row.avatar_public_id,
  emailVerified: row.email_verified_at !== null,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  country: string;
  currency: string;
}

export const findByEmail = async (db: Db, email: string): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );
  return result.rows[0];
};

export const findById = async (db: Db, id: UserId): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0];
};

export const create = async (
  db: Db,
  input: CreateUserInput,
): Promise<UserRow> => {
  const result = await db.query<UserRow>(
    `INSERT INTO users (name, email, password_hash, country, currency)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.name, input.email, input.passwordHash, input.country, input.currency],
  );
  return result.rows[0]!;
};

export const markEmailVerified = async (
  db: Db,
  id: UserId,
): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    `UPDATE users
     SET email_verified_at = COALESCE(email_verified_at, now())
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0];
};

export const updatePasswordHash = async (
  db: Db,
  id: UserId,
  passwordHash: string,
): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    `UPDATE users
     SET password_hash = $1
     WHERE id = $2
     RETURNING *`,
    [passwordHash, id],
  );
  return result.rows[0];
};

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
  avatarPublicId?: string;
}

export const updateProfile = async (
  db: Db,
  id: UserId,
  input: UpdateProfileInput,
): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    `UPDATE users
     SET name = COALESCE($1, name),
         avatar = CASE WHEN $2::boolean THEN $3::text ELSE avatar END,
         avatar_public_id = CASE WHEN $2::boolean THEN $4::text ELSE avatar_public_id END
     WHERE id = $5
     RETURNING *`,
    [
      input.name ?? null,
      input.avatar !== undefined,
      input.avatar ?? null,
      input.avatarPublicId ?? null,
      id,
    ],
  );
  return result.rows[0];
};