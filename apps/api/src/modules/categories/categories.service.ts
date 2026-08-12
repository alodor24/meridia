import { pool } from '../../database/pool';
import { ConflictError, NotFoundError } from '../../shared/errors';
import * as categoriesRepository from './categories.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schemas';
import type { CategoryId, UserId } from '@meridia/shared';

export const listCategories = async (userId: UserId, type?: 'income' | 'expense') => {
  const rows = await categoriesRepository.listByUser(pool, userId, type);
  return rows.map(categoriesRepository.mapCategoryRow);
};

export const getCategory = async (userId: UserId, id: CategoryId) => {
  const row = await categoriesRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
};

export const createCategory = async (userId: UserId, input: CreateCategoryInput) => {
  const row = await categoriesRepository.create(pool, userId, input);
  return categoriesRepository.mapCategoryRow(row);
};

export const updateCategory = async (userId: UserId, id: CategoryId, input: UpdateCategoryInput) => {
  const row = await categoriesRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Categoría no encontrada');
  return categoriesRepository.mapCategoryRow(row);
};

export const deleteCategory = async (userId: UserId, id: CategoryId): Promise<void> => {
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
};