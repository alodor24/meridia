import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reminderApi } from "../services/api";
import { reminderKeys } from "../reminderKeys";
import type { ReminderFilters } from "../types";

export const useListReminders = (filters: ReminderFilters) => {
  const queryOptions = {
    queryKey: reminderKeys.list(filters),
    queryFn: () => reminderApi.listReminders(filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(filters.from && filters.to),
  };

  return useQuery(queryOptions);
};
