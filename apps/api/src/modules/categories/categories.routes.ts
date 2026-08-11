import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  categoryParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from './categories.schemas';
import * as categoriesController from './categories.controller';

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get('/', categoriesController.list);
categoriesRouter.post('/', validate(createCategorySchema), categoriesController.create);
categoriesRouter.get('/:id', validate(categoryParamsSchema, 'params'), categoriesController.getOne);
categoriesRouter.patch('/:id', validate(categoryParamsSchema, 'params'), validate(updateCategorySchema), categoriesController.update);
categoriesRouter.delete('/:id', validate(categoryParamsSchema, 'params'), categoriesController.remove);
