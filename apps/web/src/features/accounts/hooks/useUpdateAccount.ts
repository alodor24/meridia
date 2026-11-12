import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalKeys } from "@/features/goals/goalKeys";
import { accountApi } from "../services/api";
import { accountKeys } from "../accountKeys";
import { UpdateAccountPayload } from "../types";

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAccountPayload) =>
      accountApi.updateAccount(id, payload),

    onSuccess: (updatedAccount) => {
      queryClient.setQueryData(
        accountKeys.detail(updatedAccount.id),
        updatedAccount,
      );

      queryClient.invalidateQueries({
        queryKey: accountKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: goalKeys.all,
      });
    },
  });
};
