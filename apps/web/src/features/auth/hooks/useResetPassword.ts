import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenManager } from "@/services/api/tokenManager";
import { authApi } from "../services/api";

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.resetPassword,

    onSuccess: () => {
      tokenManager.clear();
      queryClient.clear();
    },
  });
};
