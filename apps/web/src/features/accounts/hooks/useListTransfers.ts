import { useQuery } from "@tanstack/react-query";
import { transferApi } from "../services/api";
import { transferKeys } from "../transferKeys";
import type { TransferFilters } from "../types";

export const useListTransfers = (filters: TransferFilters) => {
  return useQuery({
    queryKey: transferKeys.list(filters),
    queryFn: () => transferApi.listTransfers(filters),
  });
};
