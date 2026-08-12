import type { Account, AccountType, Paginated } from "@meridia/shared";
import { http } from "@/services/api/client";

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency?: string;
}

export const listAccounts = async () => {
  const result = await http.get<Paginated<Account>>("/api/accounts");
  return result.items;
};

export const createAccount = async (payload: CreateAccountPayload) => {
  const result = await http.post<{ account: Account }>(
    "/api/accounts",
    payload,
  );
  return result.account;
};

export const updateAccount = async (
  id: string,
  payload: Partial<CreateAccountPayload>,
) => {
  const result = await http.patch<{ account: Account }>(
    `/api/accounts/${id}`,
    payload,
  );
  return result.account;
};

export const deleteAccount = (id: string) =>
  http.delete<null>(`/api/accounts/${id}`);
