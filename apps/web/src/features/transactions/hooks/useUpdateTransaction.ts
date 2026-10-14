import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/api";
import { UpdateTransactionPayload } from "../types";
import { invalidateTransactionQueries } from "@/services/query/invalidations";

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTransactionPayload) =>
      transactionApi.updateTransaction(id, payload),

    onSuccess: () => invalidateTransactionQueries(queryClient),
  });
};
