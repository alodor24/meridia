import type {
  Paginated,
  Transaction,
  TransactionFilters,
} from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";
import { CreateTransactionPayload } from "../types";

const cleanParams = (filters: TransactionFilters): Record<string, unknown> => {
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params[key] = value;
  }
  return params;
};

export const transactionApi = {
  listTransactions: (filters: TransactionFilters = {}) =>
    http.get<Paginated<Transaction>>(ENDPOINT_ROUTES.TRANSACTIONS, {
      params: cleanParams(filters),
    }),

  createTransaction: async (payload: CreateTransactionPayload) => {
    const result = await http.post<{ transaction: Transaction }>(
      ENDPOINT_ROUTES.TRANSACTIONS,
      payload,
    );
    return result.transaction;
  },

  updateTransaction: async (
    id: string,
    payload: Partial<CreateTransactionPayload>,
  ) => {
    const result = await http.patch<{ transaction: Transaction }>(
      `${ENDPOINT_ROUTES.TRANSACTIONS}/${id}`,
      payload,
    );
    return result.transaction;
  },

  deleteTransaction: (id: string) =>
    http.delete<null>(`${ENDPOINT_ROUTES.TRANSACTIONS}/${id}`),
};
