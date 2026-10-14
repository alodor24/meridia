import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../services/api";
import { accountKeys } from "../accountKeys";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.createAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountKeys.lists(),
      });
    },
  });
};
