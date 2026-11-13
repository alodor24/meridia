import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountKeys } from "@/features/accounts/accountKeys";
import { transferKeys } from "@/features/accounts/transferKeys";
import { notificationKeys } from "@/features/notifications/notificationKeys";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";
import type { GoalContributionPayload } from "../types";

interface ContributeToGoalVariables {
  id: string;
  payload: GoalContributionPayload;
}

export const useContributeToGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ContributeToGoalVariables) =>
      goalApi.contributeToGoal(id, payload),

    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: goalKeys.all }),
        queryClient.invalidateQueries({ queryKey: accountKeys.all }),
        queryClient.invalidateQueries({ queryKey: transferKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]),
  });
};
