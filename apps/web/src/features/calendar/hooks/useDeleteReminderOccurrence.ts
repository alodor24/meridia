import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateReminderQueries } from "@/services/query/invalidations";
import { reminderApi } from "../services/api";

interface DeleteReminderOccurrenceVariables {
  reminderId: string;
  occurrenceDate: string;
}

export const useDeleteReminderOccurrence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reminderId,
      occurrenceDate,
    }: DeleteReminderOccurrenceVariables) =>
      reminderApi.deleteReminderOccurrence(reminderId, occurrenceDate),
    onSuccess: () => invalidateReminderQueries(queryClient),
  });
};
