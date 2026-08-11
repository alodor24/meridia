import type { Request, Response } from 'express';
import { sendNoContent, sendPaginated, sendSuccess } from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as accountsService from './accounts.service';
import type { AccountId } from '@meridia/shared';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const accounts = await accountsService.listAccounts(req.user!.id);
  sendPaginated(res, { items: accounts, total: accounts.length });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountsService.getAccount(req.user!.id, req.params.id as AccountId);
  sendSuccess(res, { account });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountsService.createAccount(req.user!.id, req.body);
  sendSuccess(res, { account }, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountsService.updateAccount(
    req.user!.id,
    req.params.id as AccountId,
    req.body,
  );
  sendSuccess(res, { account });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await accountsService.deleteAccount(req.user!.id, req.params.id as AccountId);
  sendNoContent(res);
});
