import type { Request, Response } from 'express';
import { sendNoContent, sendPaginated, sendSuccess } from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as transactionsService from './transactions.service';
import type { ListTransactionsQuery } from './transactions.schemas';
import type { TransactionId } from '@meridia/shared';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await transactionsService.listTransactions(
    req.user!.id,
    req.query as unknown as ListTransactionsQuery,
  );
  sendPaginated(res, data);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionsService.getTransaction(req.user!.id, req.params.id as TransactionId);
  sendSuccess(res, { transaction });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionsService.createTransaction(req.user!.id, req.body);
  sendSuccess(res, { transaction }, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionsService.updateTransaction(
    req.user!.id,
    req.params.id as TransactionId,
    req.body,
  );
  sendSuccess(res, { transaction });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await transactionsService.deleteTransaction(req.user!.id, req.params.id as TransactionId);
  sendNoContent(res);
});
