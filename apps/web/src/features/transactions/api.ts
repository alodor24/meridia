import type { Paginated, Transaction, TransactionType } from "@meridia/shared";
import { http } from "@/services/api/client";

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

const cleanParams = (filters: TransactionFilters): Record<string, unknown> => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params[key] = value;
  }
  return params;
};

export const listTransactions = (filters: TransactionFilters = {}) =>
  http.get<Paginated<Transaction>>("/api/transactions", {
    params: cleanParams(filters),
  });

export const createTransaction = async (payload: CreateTransactionPayload) => {
  const result = await http.post<{ transaction: Transaction }>(
    "/api/transactions",
    payload,
  );
  return result.transaction;
};

export const updateTransaction = async (
  id: string,
  payload: Partial<CreateTransactionPayload>,
) => {
  const result = await http.patch<{ transaction: Transaction }>(
    `/api/transactions/${id}`,
    payload,
  );
  return result.transaction;
};

export const deleteTransaction = (id: string) =>
  http.delete<null>(`/api/transactions/${id}`);
