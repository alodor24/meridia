import { TransactionType } from "@meridia/shared";

export interface CreateTransactionPayload {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}

export interface UpdateTransactionPayload {
  id: string;
  payload: Partial<CreateTransactionPayload>;
}

export interface Filters {
  from: string;
  to: string;
  accountId: string;
  categoryId: string;
  type: "" | TransactionType;
}
