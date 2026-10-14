import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/api";
import { DashboardRange } from "../types";
import { dashboardKeys } from "../dashboardKeys";

export const useDashboardSummary = (range?: DashboardRange) => {
  const queryOptions = {
    queryKey: dashboardKeys.summary(range),
    queryFn: () => dashboardApi.getDashboard(range),
  };

  return useQuery(queryOptions);
};
