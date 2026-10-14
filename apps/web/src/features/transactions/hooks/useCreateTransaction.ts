import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/api";
import { invalidateTransactionQueries } from "@/services/query/invalidations";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransaction,

    onSuccess: () => invalidateTransactionQueries(queryClient),
  });
};
