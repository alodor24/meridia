import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../middlewares/validate";
import { reportQuerySchema } from "./reports.schemas";
import * as reportsController from "./reports.controller";

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.get(
  "/transactions",
  validate(reportQuerySchema, "query"),
  reportsController.transactions,
);
