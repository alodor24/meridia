import type { Category, CategoryId, TransactionType, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryInput {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: TransactionType;
  color?: string;
  icon?: string;
}

export const mapCategoryRow = (row: CategoryRow): Category => ({
  id: row.id as CategoryId,
  userId: row.user_id as UserId,
  name: row.name,
  type: row.type,
  color: row.color,
  icon: row.icon,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export const listByUser = async (db: Db, userId: UserId, type?: TransactionType): Promise<CategoryRow[]> => {
  const values: unknown[] = [userId];
  let typeClause = '';
  if (type) {
    values.push(type);
    typeClause = `AND c.type = $${values.length}`;
  }
  const result = await db.query<CategoryRow>(
    `SELECT c.* FROM categories c
     WHERE c.user_id = $1 ${typeClause}
     ORDER BY c.type ASC, c.name ASC`,
    values,
  );
  return result.rows;
};

export const findById = async (
  db: Db,
  userId: UserId,
  id: CategoryId,
): Promise<CategoryRow | undefined> => {
  const result = await db.query<CategoryRow>(
    'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return result.rows[0];
};

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateCategoryInput,
): Promise<CategoryRow> => {
  const result = await db.query<CategoryRow>(
    `INSERT INTO categories (user_id, name, type, color, icon)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, input.name, input.type, input.color ?? '#607d8b', input.icon],
  );
  return result.rows[0]!;
};

export const update = async (
  db: Db,
  userId: UserId,
  id: CategoryId,
  input: UpdateCategoryInput,
): Promise<CategoryRow | undefined> => {
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
  if (input.color !== undefined) {
    values.push(input.color);
    fields.push(`color = $${values.length}`);
  }
  if (input.icon !== undefined) {
    values.push(input.icon);
    fields.push(`icon = $${values.length}`);
  }
  if (fields.length === 0) return undefined;

  const result = await db.query<CategoryRow>(
    `UPDATE categories c SET ${fields.join(', ')}
     WHERE c.id = $1 AND c.user_id = $2
     RETURNING c.*`,
    values,
  );
  return result.rows[0];
};

export const countTransactions = async (db: Db, categoryId: CategoryId): Promise<number> => {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM transactions WHERE category_id = $1',
    [categoryId],
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const remove = async (db: Db, userId: UserId, id: CategoryId): Promise<boolean> => {
  const result = await db.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
};