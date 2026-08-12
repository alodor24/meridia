import type { Response } from 'express';
import type { Paginated } from '@meridia/shared';

export const sendSuccess = <T>(res: Response, data: T, status = 200): Response =>
  res.status(status).json({ success: true, data });

export const sendPaginated = <T>(res: Response, data: Paginated<T>): Response =>
  sendSuccess(res, data);

export const sendNoContent = (res: Response): Response => res.status(204).end();