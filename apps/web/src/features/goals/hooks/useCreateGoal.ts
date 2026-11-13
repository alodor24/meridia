import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountKeys } from "@/features/accounts/accountKeys";
import { notificationKeys } from "@/features/notifications/notificationKeys";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalApi.createGoal,

    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: goalKeys.all }),
        queryClient.invalidateQueries({ queryKey: accountKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]),
  });
};
