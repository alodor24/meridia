import { pool } from "../database/pool";
import { clearSentEmails } from "../shared/email/mailer";

const TABLES = [
  "notifications",
  "goals",
  "reminder_occurrences",
  "reminders",
  "feedback",
  "password_reset_tokens",
  "email_verification_tokens",
  "refresh_tokens",
  "account_transfers",
  "transactions",
  "categories",
  "accounts",
  "users",
];

export const truncateAll = async (): Promise<void> => {
  await pool.query(
    `TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`,
  );
  clearSentEmails();
};
