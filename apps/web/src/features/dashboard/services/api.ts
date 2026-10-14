import type { DashboardSummary } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";
import { DashboardRange } from "../types";

export const dashboardApi = {
  getDashboard: async (range?: DashboardRange) => {
    const result = await http.get<{ dashboard: DashboardSummary }>(
      ENDPOINT_ROUTES.DASHBOARD,
      {
        params: range,
      },
    );
    return result.dashboard;
  },
};
