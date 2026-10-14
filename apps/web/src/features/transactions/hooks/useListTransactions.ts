import { useQuery } from "@tanstack/react-query";
import type { TransactionFilters } from "@meridia/shared";
import { transactionKeys } from "../transactionKeys";
import { transactionApi } from "../services/api";

export const useListTransactions = (filters: TransactionFilters = {}) => {
  const queryOptions = {
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionApi.listTransactions(filters),
  };

  return useQuery(queryOptions);
};
