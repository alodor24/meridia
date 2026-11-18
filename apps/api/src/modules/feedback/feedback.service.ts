import type { Feedback, User } from "@meridia/shared";
import { pool } from "../../database/pool";
import { sendFeedbackEmail } from "../../shared/email/mailer";
import * as feedbackRepository from "./feedback.repository";
import type { CreateFeedbackInput } from "./feedback.schemas";

export const createFeedback = async (
  user: User,
  input: CreateFeedbackInput,
): Promise<Feedback> => {
  const row = await feedbackRepository.create(pool, user.id, {
    ...input,
    avatarUrl: user.avatar,
  });
  const feedback = feedbackRepository.mapFeedbackRow(row);

  await sendFeedbackEmail({
    userName: user.name,
    userEmail: user.email,
    avatarUrl: user.avatar,
    type: feedback.type,
    subject: feedback.subject,
    message: feedback.message,
    createdAt: feedback.createdAt,
  });

  return feedback;
};
