import type { Account, AccountTransfer, Paginated } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/consts";
import type {
  CreateAccountPayload,
  CreateTransferPayload,
  TransferFilters,
} from "../types";

export const accountApi = {
  listAccounts: async () => {
    const result = await http.get<Paginated<Account>>(ENDPOINT_ROUTES.ACCOUNTS);
    return result.items;
  },

  createAccount: async (payload: CreateAccountPayload) => {
    const result = await http.post<{ account: Account }>(
      ENDPOINT_ROUTES.ACCOUNTS,
      payload,
    );
    return result.account;
  },

  updateAccount: async (id: string, payload: Partial<CreateAccountPayload>) => {
    const result = await http.patch<{ account: Account }>(
      `${ENDPOINT_ROUTES.ACCOUNTS}/${id}`,
      payload,
    );
    return result.account;
  },

  deleteAccount: (id: string) =>
    http.delete<null>(`${ENDPOINT_ROUTES.ACCOUNTS}/${id}`),
};

export const transferApi = {
  listTransfers: (filters: TransferFilters) =>
    http.get<Paginated<AccountTransfer>>(ENDPOINT_ROUTES.TRANSFERS, {
      params: filters,
    }),

  createTransfer: async (payload: CreateTransferPayload) => {
    const result = await http.post<{ transfer: AccountTransfer }>(
      ENDPOINT_ROUTES.TRANSFERS,
      payload,
    );
    return result.transfer;
  },

  deleteTransfer: (id: string) =>
    http.delete<null>(`${ENDPOINT_ROUTES.TRANSFERS}/${id}`),
};
