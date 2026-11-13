import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PATHS } from "@/consts";
import { tokenManager } from "@/services/api/tokenManager";
import { authApi } from "../services/api";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      tokenManager.clear();
      queryClient.clear();

      void navigate({
        to: PATHS.LOGIN,
        replace: true,
      });
    },
  });
};
