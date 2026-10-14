import type { DashboardRange } from "./types";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  summaries: () => [...dashboardKeys.all, "summary"] as const,

  summary: (range?: DashboardRange) =>
    [...dashboardKeys.summaries(), range ?? {}] as const,
};
