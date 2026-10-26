export const analyticsKeys = {
  all: ["analytics"] as const,

  summaries: () => [...analyticsKeys.all, "summary"] as const,

  summary: (year: number) => [...analyticsKeys.summaries(), year] as const,
};
