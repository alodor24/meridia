import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as dashboardService from './dashboard.service';

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { from, to, limit } = res.locals.validatedQuery as {
    from?: string;
    to?: string;
    limit?: number;
  };
  const data = await dashboardService.getDashboard(req.user!.id, {
    from: from || undefined,
    to: to || undefined,
    limit,
  });
  sendSuccess(res, { dashboard: data });
});
