import { AccountType } from "@meridia/shared";

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency?: string;
}

export interface UpdateAccountPayload {
  id: string;
  payload: Partial<CreateAccountPayload>;
}

export interface CreateTransferPayload {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}

export interface TransferFormValues {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  note: string;
}

export interface TransferAccountOption {
  value: string;
  label: string;
}

export interface TransferFilters {
  limit: number;
  offset: number;
}
