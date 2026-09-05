import type { DashboardSummary } from "@meridia/shared";
import { http } from "@/services/api/client";

export interface DashboardRange {
  from: string;
  to: string;
}

export const getDashboard = async (range?: DashboardRange) => {
  const result = await http.get<{ dashboard: DashboardSummary }>(
    "/api/dashboard",
    {
      params: range,
    },
  );
  return result.dashboard;
};
