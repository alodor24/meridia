import type { AccountId, TransferId, UserId } from '@meridia/shared';
import { pool, withTransaction } from '../../database/pool';
import { NotFoundError } from '../../shared/errors';
import * as accountsRepository from '../accounts/accounts.repository';
import { syncGoalReservations } from '../goals/goals.reservations';
import * as transfersRepository from './transfers.repository';
import { createTransferWithinTransaction } from './transfers.operations';
import type {
  CreateTransferInput,
  ListTransfersQuery,
} from './transfers.schemas';

export const listTransfers = async (
  userId: UserId,
  filters: ListTransfersQuery,
) => {
  const [items, total] = await Promise.all([
    transfersRepository.list(pool, userId, filters),
    transfersRepository.count(pool, userId),
  ]);

  return {
    items: items.map(transfersRepository.mapTransferRow),
    total,
  };
};

export const createTransfer = async (
  userId: UserId,
  input: CreateTransferInput,
) => {
  const fromAccountId = input.fromAccountId as AccountId;
  const toAccountId = input.toAccountId as AccountId;

  const row = await withTransaction(async (client) => {
    const created = await createTransferWithinTransaction(client, userId, input);

    await syncGoalReservations(client, userId, fromAccountId);
    await syncGoalReservations(client, userId, toAccountId);

    return created;
  });

  return transfersRepository.mapTransferRow(row);
};

export const deleteTransfer = async (
  userId: UserId,
  id: TransferId,
): Promise<void> => {
  await withTransaction(async (client) => {
    const transfer = await transfersRepository.findById(client, userId, id);
    if (!transfer) throw new NotFoundError('Transferencia no encontrada');

    const fromAccountId = transfer.from_account_id as AccountId;
    const toAccountId = transfer.to_account_id as AccountId;

    await accountsRepository.lockByIds(
      client,
      userId,
      fromAccountId,
      toAccountId,
    );

    const removed = await transfersRepository.remove(client, userId, id);
    if (!removed) throw new NotFoundError('Transferencia no encontrada');

    await syncGoalReservations(client, userId, fromAccountId);
    await syncGoalReservations(client, userId, toAccountId);
  });
};
