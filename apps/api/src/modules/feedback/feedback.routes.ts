import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { feedbackRateLimit } from "../../middlewares/rateLimit";
import { validate } from "../../middlewares/validate";
import { createFeedbackSchema } from "./feedback.schemas";
import * as feedbackController from "./feedback.controller";

export const feedbackRouter = Router();

feedbackRouter.use(authenticate);

feedbackRouter.post(
  "/",
  feedbackRateLimit,
  validate(createFeedbackSchema),
  feedbackController.create,
);
