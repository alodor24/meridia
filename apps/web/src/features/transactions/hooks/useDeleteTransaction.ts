import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/api";
import { invalidateTransactionQueries } from "@/services/query/invalidations";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.deleteTransaction,

    onSuccess: () => invalidateTransactionQueries(queryClient),
  });
};
