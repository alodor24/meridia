import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountKeys } from "@/features/accounts/accountKeys";
import { notificationKeys } from "@/features/notifications/notificationKeys";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";
import type { UpdateGoalPayload } from "../types";

interface UpdateGoalVariables {
  id: string;
  payload: UpdateGoalPayload;
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateGoalVariables) =>
      goalApi.updateGoal(id, payload),

    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: goalKeys.all }),
        queryClient.invalidateQueries({ queryKey: accountKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]),
  });
};
