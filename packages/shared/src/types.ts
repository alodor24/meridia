import type {
  AccountType,
  FeedbackType,
  NotificationType,
  ReminderOccurrenceStatus,
  ReminderRecurrenceUnit,
  TransactionType,
} from "./enums";

export type UserId = string & { readonly __brand: "UserId" };
export type AccountId = string & { readonly __brand: "AccountId" };
export type CategoryId = string & { readonly __brand: "CategoryId" };
export type TransactionId = string & { readonly __brand: "TransactionId" };
export type TransferId = string & { readonly __brand: "TransferId" };
export type FeedbackId = string & { readonly __brand: "FeedbackId" };
export type ReminderId = string & { readonly __brand: "ReminderId" };
export type NotificationId = string & { readonly __brand: "NotificationId" };

export interface User {
  id: UserId;
  email: string;
  name: string;
  country: string;
  currency: string;
  avatar: string | null;
  avatarPublicId: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: AccountId;
  userId: UserId;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: CategoryId;
  userId: UserId;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: TransactionId;
  userId: UserId;
  accountId: AccountId;
  categoryId: CategoryId;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;
  accountName?: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountTransfer {
  id: TransferId;
  userId: UserId;
  fromAccountId: AccountId;
  toAccountId: AccountId;
  fromAccountName: string;
  toAccountName: string;
  currency: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export interface Feedback {
  id: FeedbackId;
  userId: UserId;
  type: FeedbackType;
  subject: string;
  message: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ReminderRecurrence {
  unit: ReminderRecurrenceUnit;
  interval: number;
  endDate: string | null;
}

export interface Reminder {
  id: ReminderId;
  userId: UserId;
  title: string;
  startDate: string;
  recurrence: ReminderRecurrence | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderOccurrence {
  reminderId: ReminderId;
  occurrenceDate: string;
  date: string;
  title: string;
  seriesTitle: string;
  seriesStartDate: string;
  status: ReminderOccurrenceStatus;
  paidAt: string | null;
  recurrence: ReminderRecurrence | null;
}

export interface AppNotification {
  id: NotificationId;
  type: NotificationType;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface DashboardSummary {
  totalBalance: number;
  income: number;
  expenses: number;
  periodBalance: number;
  lastTransactions: Transaction[];
  expensesByCategory: Array<{
    categoryId: CategoryId;
    name: string;
    color: string;
    total: number;
  }>;
  incomesByCategory: Array<{
    categoryId: CategoryId;
    name: string;
    color: string;
    total: number;
  }>;
  monthSummary: Array<{
    day: number;
    income: number;
    expenses: number;
    balance: number;
  }>;
}

export interface CategoryTotal {
  categoryId: CategoryId;
  name: string;
  color: string;
  total: number;
}

export interface AnalyticsMonthlyTotal {
  month: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface AnalyticsQuarterlyTotal {
  quarter: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface AnalyticsSummary {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthly: AnalyticsMonthlyTotal[];
  quarterly: AnalyticsQuarterlyTotal[];
  expensesByCategory: CategoryTotal[];
  incomesByCategory: CategoryTotal[];
  availableYears: {
    min: number;
    max: number;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  accountId?: AccountId;
  categoryId?: CategoryId;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}
