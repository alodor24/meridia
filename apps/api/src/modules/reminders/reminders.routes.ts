import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import * as remindersController from './reminders.controller';
import {
  createReminderSchema,
  listRemindersQuerySchema,
  reminderOccurrenceParamsSchema,
  reminderParamsSchema,
  updateReminderOccurrenceSchema,
  updateReminderSchema,
} from './reminders.schemas';

export const remindersRouter = Router();

remindersRouter.use(authenticate);

remindersRouter.get(
  '/',
  validate(listRemindersQuerySchema, 'query'),
  remindersController.list,
);
remindersRouter.post(
  '/',
  validate(createReminderSchema),
  remindersController.create,
);
remindersRouter.patch(
  '/:id/occurrences/:occurrenceDate',
  validate(reminderOccurrenceParamsSchema, 'params'),
  validate(updateReminderOccurrenceSchema),
  remindersController.updateOccurrence,
);
remindersRouter.delete(
  '/:id/occurrences/:occurrenceDate',
  validate(reminderOccurrenceParamsSchema, 'params'),
  remindersController.removeOccurrence,
);
remindersRouter.patch(
  '/:id',
  validate(reminderParamsSchema, 'params'),
  validate(updateReminderSchema),
  remindersController.update,
);
remindersRouter.delete(
  '/:id',
  validate(reminderParamsSchema, 'params'),
  remindersController.remove,
);
