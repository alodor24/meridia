import type { QueryClient } from "@tanstack/react-query";
import { reminderKeys } from "@/features/calendar/reminderKeys";

export const invalidateReminderQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: reminderKeys.all });
