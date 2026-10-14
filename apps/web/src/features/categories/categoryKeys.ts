import type { TransactionType } from "@meridia/shared";

export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (type?: TransactionType) =>
    [...categoryKeys.lists(), { type }] as const,

  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: string) => [...categoryKeys.details(), id] as const,
};
