import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/http";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import * as feedbackService from "./feedback.service";
import type { CreateFeedbackInput } from "./feedback.schemas";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await feedbackService.createFeedback(
    req.user!,
    req.body as CreateFeedbackInput,
  );
  sendSuccess(res, { feedback }, 201);
});
