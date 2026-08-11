import { pool } from '../../database/pool';
import { ConflictError, NotFoundError } from '../../shared/errors';
import * as categoriesRepository from './categories.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';
import type { CategoryId, UserId } from '@meridia/shared';

export async function listCategories(userId: UserId, type?: 'income' | 'expense') {
  const rows = await categoriesRepository.listByUser(pool, userId, type);
  return rows.map(categoriesRepository.mapCategoryRow);
}

export async function getCategory(userId: UserId, id: CategoryId) {
  const row = await categoriesRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
}

export async function createCategory(userId: UserId, input: CreateCategoryInput) {
  const row = await categoriesRepository.create(pool, userId, input);
  return categoriesRepository.mapCategoryRow(row);
}

export async function updateCategory(userId: UserId, id: CategoryId, input: UpdateCategoryInput) {
  const row = await categoriesRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
}

export async function deleteCategory(userId: UserId, id: CategoryId): Promise<void> {
  const row = await categoriesRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Categoría no encontrada');

  const transactionCount = await categoriesRepository.countTransactions(pool, id);
  if (transactionCount > 0) {
    throw new ConflictError(
      'La categoría está en uso por movimientos. Reasignalos o eliminalos primero.',
      'CATEGORY_IN_USE',
    );
  }

  await categoriesRepository.remove(pool, userId, id);
}
