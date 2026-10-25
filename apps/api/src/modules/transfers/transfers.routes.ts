import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  createTransferSchema,
  listTransfersQuerySchema,
  transferParamsSchema,
} from './transfers.schemas';
import * as transfersController from './transfers.controller';

export const transfersRouter = Router();

transfersRouter.use(authenticate);

transfersRouter.get(
  '/',
  validate(listTransfersQuerySchema, 'query'),
  transfersController.list,
);
transfersRouter.post(
  '/',
  validate(createTransferSchema),
  transfersController.create,
);
transfersRouter.delete(
  '/:id',
  validate(transferParamsSchema, 'params'),
  transfersController.remove,
);
