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
