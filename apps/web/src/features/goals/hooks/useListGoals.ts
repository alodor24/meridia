import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { goalApi } from "../services/api";
import { goalKeys } from "../goalKeys";
import type { GoalFilters } from "../types";

export const useListGoals = (filters: GoalFilters = {}) =>
  useQuery({
    queryKey: goalKeys.list(filters),
    queryFn: () => goalApi.listGoals(filters),
    placeholderData: keepPreviousData,
  });
