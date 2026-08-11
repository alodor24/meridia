import type { Category, TransactionType } from '@meridia/shared';
import type { Db } from '../../database/types';

export interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  color: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryInput {
  name: string;
  type: TransactionType;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: TransactionType;
  color?: string;
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    color: row.color,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listByUser(db: Db, userId: string, type?: TransactionType): Promise<CategoryRow[]> {
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
}

export async function findById(db: Db, userId: string, id: string): Promise<CategoryRow | undefined> {
  const result = await db.query<CategoryRow>(
    'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return result.rows[0];
}

export async function create(db: Db, userId: string, input: CreateCategoryInput): Promise<CategoryRow> {
  const result = await db.query<CategoryRow>(
    `INSERT INTO categories (user_id, name, type, color)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, input.name, input.type, input.color ?? '#607d8b'],
  );
  return result.rows[0]!;
}

export async function update(
  db: Db,
  userId: string,
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryRow | undefined> {
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
  if (fields.length === 0) return undefined;

  const result = await db.query<CategoryRow>(
    `UPDATE categories c SET ${fields.join(', ')}
     WHERE c.id = $1 AND c.user_id = $2
     RETURNING c.*`,
    values,
  );
  return result.rows[0];
}

export async function countTransactions(db: Db, categoryId: string): Promise<number> {
  const result = await db.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM transactions WHERE category_id = $1',
    [categoryId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function remove(db: Db, userId: string, id: string): Promise<boolean> {
  const result = await db.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
}
