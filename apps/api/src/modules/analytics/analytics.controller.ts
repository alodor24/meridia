import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/http";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import * as analyticsService from "./analytics.service";
import type { AnalyticsQuery } from "./analytics.schemas";

export const getAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { year } = res.locals.validatedQuery as AnalyticsQuery;
    const data = await analyticsService.getAnalytics(
      req.user!.id,
      year ?? new Date().getFullYear(),
    );
    sendSuccess(res, { analytics: data });
  },
);
