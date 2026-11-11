import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../services/api";
import { analyticsKeys } from "../analyticsKeys";

export const useAnalyticsSummary = (year: number) => {
  const queryOptions = {
    queryKey: analyticsKeys.summary(year),
    queryFn: () => analyticsApi.getAnalytics(year),
    placeholderData: keepPreviousData,
  };

  return useQuery(queryOptions);
};
