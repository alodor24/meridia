import { pool, withTransaction } from "../../database/pool";
import { NotFoundError, ValidationError } from "../../shared/errors";
import * as accountsRepository from "../accounts/accounts.repository";
import * as categoriesRepository from "../categories/categories.repository";
import * as transactionsRepository from "./transactions.repository";
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from "./transactions.schemas";
import type {
  AccountId,
  CategoryId,
  TransactionId,
  UserId,
} from "@meridia/shared";

export const listTransactions = async (
  userId: UserId,
  filters: ListTransactionsQuery,
) => {
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
  if (!row) throw new NotFoundError("Movimiento no encontrado");
  return transactionsRepository.mapTransactionRow(row);
};

const assertCategoryMatchesType = async (
  userId: UserId,
  categoryId: CategoryId,
  type: "income" | "expense",
): Promise<void> => {
  const category = await categoriesRepository.findById(
    pool,
    userId,
    categoryId,
  );
  if (!category) throw new NotFoundError("Categoría no encontrada");
  if (category.type !== type) {
    throw new ValidationError(
      `La categoría "${category.name}" no corresponde a un movimiento de tipo ${type === "income" ? "ingreso" : "gasto"}`,
      { code: "CATEGORY_TYPE_MISMATCH" },
    );
  }
};

export const createTransaction = async (
  userId: UserId,
  input: CreateTransactionInput,
) => {
  const accountId = input.accountId as AccountId;
  const categoryId = input.categoryId as CategoryId;
  await assertCategoryMatchesType(userId, categoryId, input.type);

  const row = await withTransaction(async (client) => {
    const account = await accountsRepository.lockById(
      client,
      userId,
      accountId,
    );
    if (!account) throw new NotFoundError("Cuenta no encontrada");

    const created = await transactionsRepository.create(client, userId, {
      ...input,
      accountId,
      categoryId,
    });

    return created;
  });

  return transactionsRepository.mapTransactionRow(row);
};

export const updateTransaction = async (
  userId: UserId,
  id: TransactionId,
  input: UpdateTransactionInput,
) => {
  const existing = await transactionsRepository.findById(pool, userId, id);
  if (!existing) throw new NotFoundError("Movimiento no encontrado");

  const nextType = input.type ?? existing.type;
  const nextCategoryId =
    (input.categoryId as CategoryId | undefined) ??
    (existing.category_id as CategoryId);
  const previousAccountId = existing.account_id as AccountId;
  const nextAccountId =
    (input.accountId as AccountId | undefined) ?? previousAccountId;

  await assertCategoryMatchesType(userId, nextCategoryId, nextType);

  const row = await withTransaction(async (client) => {
    const lockedIds = await accountsRepository.lockByIds(
      client,
      userId,
      previousAccountId,
      nextAccountId,
    );
    const expectedAccounts = previousAccountId === nextAccountId ? 1 : 2;
    if (lockedIds.length !== expectedAccounts) {
      throw new NotFoundError("Cuenta no encontrada");
    }

    const updated = await transactionsRepository.update(client, userId, id, {
      ...input,
      accountId: input.accountId as AccountId | undefined,
      categoryId: input.categoryId as CategoryId | undefined,
    });
    if (!updated) throw new NotFoundError("Movimiento no encontrado");

    return updated;
  });

  return transactionsRepository.mapTransactionRow(row);
};

export const deleteTransaction = async (
  userId: UserId,
  id: TransactionId,
): Promise<void> => {
  const existing = await transactionsRepository.findById(pool, userId, id);
  if (!existing) throw new NotFoundError("Movimiento no encontrado");

  const accountId = existing.account_id as AccountId;

  await withTransaction(async (client) => {
    const account = await accountsRepository.lockById(
      client,
      userId,
      accountId,
    );
    if (!account) throw new NotFoundError("Cuenta no encontrada");

    const removed = await transactionsRepository.remove(client, userId, id);
    if (!removed) throw new NotFoundError("Movimiento no encontrado");
  });
};
