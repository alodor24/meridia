import type { Request, Response } from 'express';
import type { TransferId } from '@meridia/shared';
import {
  sendNoContent,
  sendPaginated,
  sendSuccess,
} from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as transfersService from './transfers.service';
import type { ListTransfersQuery } from './transfers.schemas';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await transfersService.listTransfers(
    req.user!.id,
    res.locals.validatedQuery as ListTransfersQuery,
  );
  sendPaginated(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const transfer = await transfersService.createTransfer(
    req.user!.id,
    req.body,
  );
  sendSuccess(res, { transfer }, 201);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await transfersService.deleteTransfer(
    req.user!.id,
    req.params.id as TransferId,
  );
  sendNoContent(res);
});
