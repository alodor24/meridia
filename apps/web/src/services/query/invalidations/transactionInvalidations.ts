import { QueryClient } from "@tanstack/react-query";
import { accountKeys } from "@/features/accounts/accountKeys";
import { dashboardKeys } from "@/features/dashboard/dashboardKeys";
import { goalKeys } from "@/features/goals/goalKeys";
import { notificationKeys } from "@/features/notifications/notificationKeys";
import { transactionKeys } from "@/features/transactions/transactionKeys";

export const invalidateTransactionQueries = (queryClient: QueryClient) => {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: transactionKeys.all,
    }),

    queryClient.invalidateQueries({
      queryKey: accountKeys.all,
    }),

    queryClient.invalidateQueries({
      queryKey: dashboardKeys.all,
    }),

    queryClient.invalidateQueries({
      queryKey: goalKeys.all,
    }),

    queryClient.invalidateQueries({
      queryKey: notificationKeys.all,
    }),
  ]);
};
