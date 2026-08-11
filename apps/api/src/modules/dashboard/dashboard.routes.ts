import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { dashboardQuerySchema } from './dashboard.schemas';
import * as dashboardController from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/', validate(dashboardQuerySchema, 'query'), dashboardController.getDashboard);
