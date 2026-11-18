import type {
  Feedback,
  FeedbackId,
  FeedbackType,
  UserId,
} from "@meridia/shared";
import type { Db } from "../../database/types";

export interface FeedbackRow {
  id: string;
  user_id: string;
  type: FeedbackType;
  subject: string;
  message: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface CreateFeedbackRecordInput {
  type: FeedbackType;
  subject: string;
  message: string;
  avatarUrl: string | null;
}

export const mapFeedbackRow = (row: FeedbackRow): Feedback => ({
  id: row.id as FeedbackId,
  userId: row.user_id as UserId,
  type: row.type,
  subject: row.subject,
  message: row.message,
  avatarUrl: row.avatar_url,
  createdAt: row.created_at.toISOString(),
});

export const create = async (
  db: Db,
  userId: UserId,
  input: CreateFeedbackRecordInput,
): Promise<FeedbackRow> => {
  const result = await db.query<FeedbackRow>(
    `INSERT INTO feedback (user_id, type, subject, message, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, type, subject, message, avatar_url, created_at`,
    [userId, input.type, input.subject, input.message, input.avatarUrl],
  );

  return result.rows[0]!;
};
