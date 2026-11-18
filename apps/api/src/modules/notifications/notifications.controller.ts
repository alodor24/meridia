import type { Request, Response } from 'express';
import type { NotificationId } from '@meridia/shared';
import { sendSuccess } from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as notificationsService from './notifications.service';
import type { ListNotificationsQuery } from './notifications.schemas';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationsService.listNotifications(
    req.user!.id,
    res.locals.validatedQuery as ListNotificationsQuery,
  );
  sendSuccess(res, data);
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationsService.markNotificationRead(
    req.user!.id,
    req.params.id as NotificationId,
  );
  sendSuccess(res, { notification });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationsService.markAllNotificationsRead(req.user!.id);
  sendSuccess(res, data);
});
