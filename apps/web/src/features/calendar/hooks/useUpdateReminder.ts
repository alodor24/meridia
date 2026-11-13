import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateReminderQueries } from "@/services/query/invalidations";
import { reminderApi } from "../services/api";
import type { UpdateReminderPayload } from "../types";

interface UpdateReminderVariables {
  id: string;
  payload: UpdateReminderPayload;
}

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateReminderVariables) =>
      reminderApi.updateReminder(id, payload),
    onSuccess: () => invalidateReminderQueries(queryClient),
  });
};
