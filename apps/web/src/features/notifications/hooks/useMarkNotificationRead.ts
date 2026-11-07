import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../notificationKeys";
import { notificationApi } from "../services/api";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markRead,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};
