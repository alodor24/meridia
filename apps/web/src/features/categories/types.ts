import { TransactionType } from "@meridia/shared";

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryPayload {
  id: string;
  payload: Partial<CreateCategoryPayload>;
}
