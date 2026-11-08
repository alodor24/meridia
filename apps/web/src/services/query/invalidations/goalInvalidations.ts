import type { QueryClient } from "@tanstack/react-query";
import { goalKeys } from "@/features/goals/goalKeys";
import { notificationKeys } from "@/features/notifications/notificationKeys";

export const invalidateGoalQueries = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: goalKeys.all }),
    queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  ]);
