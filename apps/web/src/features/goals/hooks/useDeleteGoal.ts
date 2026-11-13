import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/features/notifications/notificationKeys";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalApi.deleteGoal,

    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: goalKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]),
  });
};
