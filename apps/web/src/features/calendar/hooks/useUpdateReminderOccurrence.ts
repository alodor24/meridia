import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateReminderQueries } from "@/services/query/invalidations";
import { reminderApi } from "../services/api";
import type { UpdateReminderOccurrencePayload } from "../types";

interface UpdateReminderOccurrenceVariables {
  reminderId: string;
  occurrenceDate: string;
  payload: UpdateReminderOccurrencePayload;
}

export const useUpdateReminderOccurrence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reminderId,
      occurrenceDate,
      payload,
    }: UpdateReminderOccurrenceVariables) =>
      reminderApi.updateReminderOccurrence(
        reminderId,
        occurrenceDate,
        payload,
      ),
    onSuccess: () => invalidateReminderQueries(queryClient),
  });
};
