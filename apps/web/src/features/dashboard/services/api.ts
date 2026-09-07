import type { DashboardSummary } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";

export interface DashboardRange {
  from: string;
  to: string;
}

export const getDashboard = async (range?: DashboardRange) => {
  const result = await http.get<{ dashboard: DashboardSummary }>(
    ENDPOINT_ROUTES.DASHBOARD,
    {
      params: range,
    },
  );
  return result.dashboard;
};
