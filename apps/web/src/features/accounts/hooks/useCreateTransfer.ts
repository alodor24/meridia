import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountKeys } from "../accountKeys";
import { transferApi } from "../services/api";
import { transferKeys } from "../transferKeys";
import type { CreateTransferPayload } from "../types";

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransferPayload) =>
      transferApi.createTransfer(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transferKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: accountKeys.all,
      });
    },
  });
};
