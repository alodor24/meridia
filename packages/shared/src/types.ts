import type { AccountType, TransactionType } from './enums';

export type UserId = string & { readonly __brand: 'UserId' };
export type AccountId = string & { readonly __brand: 'AccountId' };
export type CategoryId = string & { readonly __brand: 'CategoryId' };
export type TransactionId = string & { readonly __brand: 'TransactionId' };

export interface User {
  id: UserId;
  email: string;
  name: string;
  country: string;
  currency: string;
  avatar: string | null;
  avatarPublicId: string | null;
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
