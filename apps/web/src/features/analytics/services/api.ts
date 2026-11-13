import type { AnalyticsSummary } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/consts";

export const analyticsApi = {
  getAnalytics: async (year: number) => {
    const result = await http.get<{ analytics: AnalyticsSummary }>(
      ENDPOINT_ROUTES.ANALYTICS,
      {
        params: { year },
      },
    );
    return result.analytics;
  },
};
