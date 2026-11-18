export const ACCOUNT_TYPES = [
  "cash",
  "bank",
  "credit_card",
  "savings",
  "investment",
  "wallet",
] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const TRANSACTION_TYPES = ["income", "expense"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSFERABLE_ACCOUNT_TYPES = [
  "cash",
  "bank",
  "wallet",
  "savings",
] as const;

export const NOTIFICATION_TYPES = ["goal_completed"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const FEEDBACK_TYPES = [
  "suggestion",
  "comment",
  "use_case",
  "testimonial",
] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const REMINDER_RECURRENCE_UNITS = [
  "day",
  "week",
  "month",
  "year",
] as const;
export type ReminderRecurrenceUnit = (typeof REMINDER_RECURRENCE_UNITS)[number];

export const REMINDER_OCCURRENCE_STATUSES = ["pending", "paid"] as const;
export type ReminderOccurrenceStatus =
  (typeof REMINDER_OCCURRENCE_STATUSES)[number];

export const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
  suggestion: "Sugerencia",
  comment: "Comentario",
  use_case: "Caso de uso",
  testimonial: "Testimonio",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Efectivo",
  bank: "Banco",
  credit_card: "Tarjeta de crédito",
  savings: "Ahorro",
  investment: "Inversión",
  wallet: "Billetera virtual",
};
