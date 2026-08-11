import type { Paginated, Transaction, TransactionType } from '@meridia/shared';
import { http } from '@/services/api/client';

export interface TransactionFilters {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionPayload {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}

export const listTransactions = (filters: TransactionFilters = {}) =>
  http.get<Paginated<Transaction>>('/api/transactions', { params: cleanParams(filters) });

export const createTransaction = (payload: CreateTransactionPayload) =>
  http.post<{ transaction: Transaction }>('/api/transactions', payload).then((r) => r.transaction);

export const updateTransaction = (id: string, payload: Partial<CreateTransactionPayload>) =>
  http.patch<{ transaction: Transaction }>(`/api/transactions/${id}`, payload).then((r) => r.transaction);

export const deleteTransaction = (id: string) =>
  http.delete<null>(`/api/transactions/${id}`);

function cleanParams(filters: TransactionFilters): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params[key] = value;
  }
  return params;
}
