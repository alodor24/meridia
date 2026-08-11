import { pool } from '../../database/pool';
import { ConflictError, NotFoundError } from '../../shared/errors';
import * as categoriesRepository from './categories.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';

export async function listCategories(userId: string, type?: 'income' | 'expense') {
  const rows = await categoriesRepository.listByUser(pool, userId, type);
  return rows.map(categoriesRepository.mapCategoryRow);
}

export async function getCategory(userId: string, id: string) {
  const row = await categoriesRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  const row = await categoriesRepository.create(pool, userId, input);
  return categoriesRepository.mapCategoryRow(row);
}

export async function updateCategory(userId: string, id: string, input: UpdateCategoryInput) {
  const row = await categoriesRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
}

export async function deleteCategory(userId: string, id: string): Promise<void> {
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
