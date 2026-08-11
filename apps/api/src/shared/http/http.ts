import type { Response } from 'express';
import type { Paginated } from '@meridia/shared';

export function sendSuccess<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

export function sendPaginated<T>(res: Response, data: Paginated<T>): Response {
  return sendSuccess(res, data);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).end();
}
