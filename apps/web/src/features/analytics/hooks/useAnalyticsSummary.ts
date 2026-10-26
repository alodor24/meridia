import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../services/api";
import { analyticsKeys } from "../analyticsKeys";

export const useAnalyticsSummary = (year: number) => {
  return useQuery({
    queryKey: analyticsKeys.summary(year),
    queryFn: () => analyticsApi.getAnalytics(year),
    placeholderData: keepPreviousData,
  });
};
