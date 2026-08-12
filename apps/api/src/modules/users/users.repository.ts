import type { User, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  country: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export const mapUserRow = (row: UserRow): User => ({
  id: row.id as UserId,
  email: row.email,
  name: row.name,
  country: row.country,
  currency: row.currency,
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

export const updateName = async (db: Db, id: UserId, name: string): Promise<UserRow | undefined> => {
  const result = await db.query<UserRow>(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [name, id],
  );
  return result.rows[0];
};