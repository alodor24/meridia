import { pool } from '../../database/pool';
import { ConflictError, NotFoundError } from '../../shared/errors';
import * as accountsRepository from './accounts.repository';
import type { CreateAccountInput, UpdateAccountInput } from './accounts.schemas';
import type { AccountId, UserId } from '@meridia/shared';

export async function listAccounts(userId: UserId) {
  const rows = await accountsRepository.listByUser(pool, userId);
  return rows.map(accountsRepository.mapAccountRow);
}

export async function getAccount(userId: UserId, id: AccountId) {
  const row = await accountsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Cuenta no encontrada');
  return accountsRepository.mapAccountRow(row);
}

export async function createAccount(userId: UserId, input: CreateAccountInput) {
  const row = await accountsRepository.create(pool, userId, {
    name: input.name,
    type: input.type,
    currency: input.currency ?? 'USD',
  });
  return accountsRepository.mapAccountRow(row);
}

export async function updateAccount(userId: UserId, id: AccountId, input: UpdateAccountInput) {
  const row = await accountsRepository.update(pool, userId, id, input);
  if (!row) throw new NotFoundError('Cuenta no encontrada');
  return accountsRepository.mapAccountRow(row);
}

export async function deleteAccount(userId: UserId, id: AccountId): Promise<void> {
  const row = await accountsRepository.findById(pool, userId, id);
  if (!row) throw new NotFoundError('Cuenta no encontrada');

  const transactionCount = await accountsRepository.countTransactions(pool, id);
  if (transactionCount > 0) {
    throw new ConflictError(
      'La cuenta tiene movimientos asociados. Eliminalos primero.',
      'ACCOUNT_HAS_TRANSACTIONS',
    );
  }

  await accountsRepository.remove(pool, userId, id);
}
