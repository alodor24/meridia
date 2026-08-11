import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  transactionParamsSchema,
  updateTransactionSchema,
} from './transactions.schemas';
import * as transactionsController from './transactions.controller';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.get('/', validate(listTransactionsQuerySchema, 'query'), transactionsController.list);
transactionsRouter.post('/', validate(createTransactionSchema), transactionsController.create);
transactionsRouter.get('/:id', validate(transactionParamsSchema, 'params'), transactionsController.getOne);
transactionsRouter.patch('/:id', validate(transactionParamsSchema, 'params'), validate(updateTransactionSchema), transactionsController.update);
transactionsRouter.delete('/:id', validate(transactionParamsSchema, 'params'), transactionsController.remove);
