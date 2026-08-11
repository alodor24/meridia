import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  accountParamsSchema,
  createAccountSchema,
  updateAccountSchema,
} from './accounts.schemas';
import * as accountsController from './accounts.controller';

export const accountsRouter = Router();

accountsRouter.use(authenticate);

accountsRouter.get('/', accountsController.list);
accountsRouter.post('/', validate(createAccountSchema), accountsController.create);
accountsRouter.get('/:id', validate(accountParamsSchema, 'params'), accountsController.getOne);
accountsRouter.patch('/:id', validate(accountParamsSchema, 'params'), validate(updateAccountSchema), accountsController.update);
accountsRouter.delete('/:id', validate(accountParamsSchema, 'params'), accountsController.remove);
