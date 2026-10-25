import type { TransferFilters } from "./types";

export const transferKeys = {
  all: ["transfers"] as const,

  lists: () => [...transferKeys.all, "list"] as const,

  list: (filters: TransferFilters) =>
    [...transferKeys.lists(), filters] as const,
};
