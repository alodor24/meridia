import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../authKeys";
import { authApi } from "../services/api";
import { tokenManager } from "@/services/api/tokenManager";
import { resetUnauthorizedHandling } from "@/auth/authSessionState";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: ({ user, accessToken }) => {
      resetUnauthorizedHandling();
      tokenManager.setAccessToken(accessToken);
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
};
