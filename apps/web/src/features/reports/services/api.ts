import { ENDPOINT_ROUTES } from "@/conts";
import { http } from "@/services/api/client";
import type { ReportFormat, ReportParams } from "../types";

const cleanParams = (params: ReportParams): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      cleaned[key] = value;
    }
  }

  return cleaned;
};

export const reportApi = {
  download: (params: ReportParams, format: ReportFormat): Promise<Blob> =>
    http.getBlob(ENDPOINT_ROUTES.REPORTS, {
      params: {
        ...cleanParams(params),
        format,
      },
    }),
};
