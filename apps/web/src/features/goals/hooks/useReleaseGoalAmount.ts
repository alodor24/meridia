import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";
import type { GoalReleasePayload } from "../types";

interface ReleaseGoalAmountVariables {
  id: string;
  payload: GoalReleasePayload;
}

export const useReleaseGoalAmount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ReleaseGoalAmountVariables) =>
      goalApi.releaseGoalAmount(id, payload),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalKeys.all }),
  });
};
