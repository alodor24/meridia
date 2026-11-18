import { TRANSFERABLE_ACCOUNT_TYPES } from '@meridia/shared';
import type { AccountId, AccountType, UserId } from '@meridia/shared';
import type { Db } from '../../database/types';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors';
import * as accountsRepository from '../accounts/accounts.repository';
import * as transfersRepository from './transfers.repository';
import type { CreateTransferInput } from './transfers.schemas';

const isTransferable = (type: AccountType): boolean =>
  TRANSFERABLE_ACCOUNT_TYPES.some((allowed) => allowed === type);

export const createTransferWithinTransaction = async (
  db: Db,
  userId: UserId,
  input: CreateTransferInput,
) => {
  const fromAccountId = input.fromAccountId as AccountId;
  const toAccountId = input.toAccountId as AccountId;
  const amount = Math.round(input.amount * 100) / 100;

  const lockedIds = await accountsRepository.lockByIds(
    db,
    userId,
    fromAccountId,
    toAccountId,
  );
  if (lockedIds.length !== 2) throw new NotFoundError('Cuenta no encontrada');

  const accounts = await accountsRepository.findByIds(
    db,
    userId,
    fromAccountId,
    toAccountId,
  );
  const fromAccount = accounts.find(
    (account) => account.id === fromAccountId,
  );
  const toAccount = accounts.find((account) => account.id === toAccountId);
  if (!fromAccount || !toAccount) {
    throw new NotFoundError('Cuenta no encontrada');
  }

  if (!isTransferable(fromAccount.type) || !isTransferable(toAccount.type)) {
    throw new ValidationError(
      'Solo puedes transferir entre cuentas de efectivo, banco, billetera o ahorro.',
    );
  }

  if (fromAccount.currency !== toAccount.currency) {
    throw new ValidationError('Las cuentas deben tener la misma moneda.');
  }

  const availableCents = Math.round(fromAccount.balance * 100);
  const amountCents = Math.round(amount * 100);
  if (amountCents > availableCents) {
    throw new ConflictError(
      'Saldo insuficiente en la cuenta de origen.',
      'INSUFFICIENT_FUNDS',
    );
  }

  return transfersRepository.create(db, userId, {
    fromAccountId,
    toAccountId,
    amount,
    note: input.note?.trim() || null,
  });
};
