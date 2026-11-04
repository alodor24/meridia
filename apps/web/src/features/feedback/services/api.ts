import { ENDPOINT_ROUTES } from "@/conts";
import { http } from "@/services/api/client";
import type { Feedback } from "@meridia/shared";
import type { FeedbackFormValues } from "../types";

export const feedbackApi = {
  create: (payload: FeedbackFormValues): Promise<{ feedback: Feedback }> =>
    http.post<{ feedback: Feedback }>(ENDPOINT_ROUTES.FEEDBACK, payload),
};
