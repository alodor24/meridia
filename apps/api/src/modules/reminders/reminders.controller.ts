import type { Request, Response } from 'express';
import type { ReminderId } from '@meridia/shared';
import {
  sendNoContent,
  sendPaginated,
  sendSuccess,
} from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as remindersService from './reminders.service';
import type {
  ListRemindersQuery,
  UpdateReminderOccurrenceInput,
} from './reminders.schemas';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await remindersService.listReminders(
    req.user!.id,
    res.locals.validatedQuery as ListRemindersQuery,
  );
  sendPaginated(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const reminder = await remindersService.createReminder(
    req.user!.id,
    req.body,
  );
  sendSuccess(res, { reminder }, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const reminder = await remindersService.updateReminder(
    req.user!.id,
    req.params.id as ReminderId,
    req.body,
  );
  sendSuccess(res, { reminder });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await remindersService.deleteReminder(
    req.user!.id,
    req.params.id as ReminderId,
  );
  sendNoContent(res);
});

export const updateOccurrence = asyncHandler(
  async (req: Request, res: Response) => {
    const occurrence = await remindersService.updateReminderOccurrence(
      req.user!.id,
      req.params.id as ReminderId,
      req.params.occurrenceDate as string,
      req.body as UpdateReminderOccurrenceInput,
    );
    sendSuccess(res, { occurrence });
  },
);

export const removeOccurrence = asyncHandler(
  async (req: Request, res: Response) => {
    await remindersService.deleteReminderOccurrence(
      req.user!.id,
      req.params.id as ReminderId,
      req.params.occurrenceDate as string,
    );
    sendNoContent(res);
  },
);
