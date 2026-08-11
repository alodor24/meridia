import type { Account, AccountType, Paginated } from '@meridia/shared';
import { http } from '@/services/api/client';

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency?: string;
}

export const listAccounts = () =>
  http.get<Paginated<Account>>('/api/accounts').then((r) => r.items);

export const createAccount = (payload: CreateAccountPayload) =>
  http.post<{ account: Account }>('/api/accounts', payload).then((r) => r.account);

export const updateAccount = (id: string, payload: Partial<CreateAccountPayload>) =>
  http.patch<{ account: Account }>(`/api/accounts/${id}`, payload).then((r) => r.account);

export const deleteAccount = (id: string) =>
  http.delete<null>(`/api/accounts/${id}`);
