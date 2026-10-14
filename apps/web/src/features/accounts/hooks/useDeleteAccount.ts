import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../services/api";
import { accountKeys } from "../accountKeys";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApi.deleteAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accountKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: accountKeys.details(),
      });
    },
  });
};
