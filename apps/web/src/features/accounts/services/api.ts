import type { Account, Paginated } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";
import { CreateAccountPayload } from "../types";

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
