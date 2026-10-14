import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/api";
import { authKeys } from "../authKeys";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
      queryClient.getQueryData(authKeys.me());
    },
  });
};
