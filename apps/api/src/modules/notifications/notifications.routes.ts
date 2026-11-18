import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import {
  listNotificationsQuerySchema,
  notificationParamsSchema,
} from './notifications.schemas';
import * as notificationsController from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get(
  '/',
  validate(listNotificationsQuerySchema, 'query'),
  notificationsController.list,
);
notificationsRouter.patch(
  '/:id/read',
  validate(notificationParamsSchema, 'params'),
  notificationsController.markRead,
);
notificationsRouter.post('/read-all', notificationsController.markAllRead);
