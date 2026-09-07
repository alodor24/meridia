import type { Account, AccountType, Paginated } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency?: string;
}

export const listAccounts = async () => {
  const result = await http.get<Paginated<Account>>(ENDPOINT_ROUTES.ACCOUNTS);
  return result.items;
};

export const createAccount = async (payload: CreateAccountPayload) => {
  const result = await http.post<{ account: Account }>(
    ENDPOINT_ROUTES.ACCOUNTS,
    payload,
  );
  return result.account;
};

export const updateAccount = async (
  id: string,
  payload: Partial<CreateAccountPayload>,
) => {
  const result = await http.patch<{ account: Account }>(
    `${ENDPOINT_ROUTES.ACCOUNTS}/${id}`,
    payload,
  );
  return result.account;
};

export const deleteAccount = (id: string) =>
  http.delete<null>(`${ENDPOINT_ROUTES.ACCOUNTS}/${id}`);
