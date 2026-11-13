import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateReminderQueries } from "@/services/query/invalidations";
import { reminderApi } from "../services/api";

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reminderApi.deleteReminder,
    onSuccess: () => invalidateReminderQueries(queryClient),
  });
};
