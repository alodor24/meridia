import { pool } from '../../database/pool';
import { ConflictError, NotFoundError } from '../../shared/errors';
import * as accountsRepository from './accounts.repository';
import type { CreateAccountInput, UpdateAccountInput } from './accounts.schemas';
import type { AccountId, UserId } from '@meridia/shared';

export const listAccounts = async (userId: UserId) => {
  const rows = await accountsRepository.listByUser(pool, userId);
  return rows.map(accountsRepository.mapAccountRow);
};

export const getAccount = async (userId: UserId, id: AccountId) => {
  const row = await accountsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Cuenta no encontrada');
  return accountsRepository.mapAccountRow(row);
};

export const createAccount = async (userId: UserId, input: CreateAccountInput) => {
  const row = await accountsRepository.create(pool, userId, {
    name: input.name,
    type: input.type,
    currency: input.currency ?? 'USD',
  });
  return accountsRepository.mapAccountRow(row);
};

export const updateAccount = async (userId: UserId, id: AccountId, input: UpdateAccountInput) => {
  const existing = await accountsRepository.findById(pool, userId, id);
  if (!existing) throw new NotFoundError('Cuenta no encontrada');

  const row = await accountsRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Cuenta no encontrada');
  return accountsRepository.mapAccountRow(row);
};

export const deleteAccount = async (userId: UserId, id: AccountId): Promise<void> => {
  const row = await accountsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Cuenta no encontrada');

  const [transactionCount, transferCount] = await Promise.all([
    accountsRepository.countTransactions(pool, id),
    accountsRepository.countTransfers(pool, id),
  ]);
  if (transactionCount > 0 || transferCount > 0) {
    throw new ConflictError(
      'La cuenta tiene movimientos o transferencias asociadas. Elimínalos primero.',
      'ACCOUNT_HAS_REFERENCES',
    );
  }

  await accountsRepository.remove(pool, userId, id);
};