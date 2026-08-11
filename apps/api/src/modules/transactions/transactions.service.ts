import { pool } from '../../database/pool';
import { NotFoundError, ValidationError } from '../../shared/errors';
import * as accountsRepository from '../accounts/accounts.repository';
import * as categoriesRepository from '../categories/categories.repository';
import * as transactionsRepository from './transactions.repository';
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from './transactions.schemas';

export async function listTransactions(userId: string, filters: ListTransactionsQuery) {
  const [items, total] = await Promise.all([
    transactionsRepository.list(pool, userId, filters),
    transactionsRepository.count(pool, userId, filters),
  ]);
  return {
    items: items.map(transactionsRepository.mapTransactionRow),
    total,
  };
}

export async function getTransaction(userId: string, id: string) {
  const row = await transactionsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Movimiento no encontrado');
  return transactionsRepository.mapTransactionRow(row);
}

async function assertAccountOwned(userId: string, accountId: string): Promise<void> {
  const account = await accountsRepository.findById(pool, userId, accountId);
  if (!account) throw new NotFoundError('Cuenta no encontrada');
}

async function assertCategoryMatchesType(
  userId: string,
  categoryId: string,
  type: 'income' | 'expense',
): Promise<void> {
  const category = await categoriesRepository.findById(pool, userId, categoryId);
  if (!category) throw new NotFoundError('Categoría no encontrada');
  if (category.type !== type) {
    throw new ValidationError(
      `La categoría "${category.name}" no corresponde a un movimiento de tipo ${type === 'income' ? 'ingreso' : 'gasto'}`,
      { code: 'CATEGORY_TYPE_MISMATCH' },
    );
  }
}

export async function createTransaction(userId: string, input: CreateTransactionInput) {
  await assertAccountOwned(userId, input.accountId);
  await assertCategoryMatchesType(userId, input.categoryId, input.type);

  const row = await transactionsRepository.create(pool, userId, input);
  return transactionsRepository.mapTransactionRow(row);
}

export async function updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
  const existing = await transactionsRepository.findById(pool, userId, id);
  if (!existing) throw new NotFoundError('Movimiento no encontrado');

  const nextType = input.type ?? existing.type;
  const nextCategoryId = input.categoryId ?? existing.category_id;

  if (input.accountId) {
    await assertAccountOwned(userId, input.accountId);
  }
  await assertCategoryMatchesType(userId, nextCategoryId, nextType);

  const row = await transactionsRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Movimiento no encontrado');
  return transactionsRepository.mapTransactionRow(row);
}

export async function deleteTransaction(userId: string, id: string): Promise<void> {
  const removed = await transactionsRepository.remove(pool, userId, id);
  if (!removed) throw new NotFoundError('Movimiento no encontrado');
}
