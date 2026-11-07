import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../notificationKeys";
import { notificationApi } from "../services/api";

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllRead,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};
