import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../middlewares/validate";
import { analyticsQuerySchema } from "./analytics.schemas";
import * as analyticsController from "./analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate);

analyticsRouter.get(
  "/",
  validate(analyticsQuerySchema, "query"),
  analyticsController.getAnalytics,
);
