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
import type { AccountId, CategoryId, TransactionId, UserId } from '@meridia/shared';

export const listTransactions = async (userId: UserId, filters: ListTransactionsQuery) => {
  const [items, total] = await Promise.all([
    transactionsRepository.list(pool, userId, filters),
    transactionsRepository.count(pool, userId, filters),
  ]);
  return {
    items: items.map(transactionsRepository.mapTransactionRow),
    total,
  };
};

export const getTransaction = async (userId: UserId, id: TransactionId) => {
  const row = await transactionsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Movimiento no encontrado');
  return transactionsRepository.mapTransactionRow(row);
};

const assertAccountOwned = async (userId: UserId, accountId: AccountId): Promise<void> => {
  const account = await accountsRepository.findById(pool, userId, accountId);
  if (!account) throw new NotFoundError('Cuenta no encontrada');
};

const assertCategoryMatchesType = async (
  userId: UserId,
  categoryId: CategoryId,
  type: 'income' | 'expense',
): Promise<void> => {
  const category = await categoriesRepository.findById(pool, userId, categoryId);
  if (!category) throw new NotFoundError('Categoría no encontrada');
  if (category.type !== type) {
    throw new ValidationError(
      `La categoría "${category.name}" no corresponde a un movimiento de tipo ${type === 'income' ? 'ingreso' : 'gasto'}`,
      { code: 'CATEGORY_TYPE_MISMATCH' },
    );
  }
};

export const createTransaction = async (userId: UserId, input: CreateTransactionInput) => {
  const accountId = input.accountId as AccountId;
  const categoryId = input.categoryId as CategoryId;
  await assertAccountOwned(userId, accountId);
  await assertCategoryMatchesType(userId, categoryId, input.type);

  const row = await transactionsRepository.create(pool, userId, {
    ...input,
    accountId,
    categoryId,
  });
  return transactionsRepository.mapTransactionRow(row);
};

export const updateTransaction = async (userId: UserId, id: TransactionId, input: UpdateTransactionInput) => {
  const existing = await transactionsRepository.findById(pool, userId, id);
  if (!existing) throw new NotFoundError('Movimiento no encontrado');

  const nextType = input.type ?? existing.type;
  const nextCategoryId = (input.categoryId as CategoryId | undefined) ?? existing.category_id as CategoryId;

  if (input.accountId) {
    await assertAccountOwned(userId, input.accountId as AccountId);
  }
  await assertCategoryMatchesType(userId, nextCategoryId, nextType);

  const row = await transactionsRepository.update(pool, userId, id, {
    ...input,
    accountId: input.accountId as AccountId | undefined,
    categoryId: input.categoryId as CategoryId | undefined,
  });
  if (!row) throw new NotFoundError('Movimiento no encontrado');
  return transactionsRepository.mapTransactionRow(row);
};

export const deleteTransaction = async (userId: UserId, id: TransactionId): Promise<void> => {
  const removed = await transactionsRepository.remove(pool, userId, id);
  if (!removed) throw new NotFoundError('Movimiento no encontrado');
};