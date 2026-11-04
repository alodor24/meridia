import type { FeedbackType } from "@meridia/shared";

export interface FeedbackFormValues {
  type: FeedbackType;
  subject: string;
  message: string;
}
