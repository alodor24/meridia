import type { AccountType, TransactionType } from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;
  accountName?: string;
  categoryName?: string;
  categoryColor?: string;
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
    categoryId: string;
    name: string;
    color: string;
    total: number;
  }>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}
