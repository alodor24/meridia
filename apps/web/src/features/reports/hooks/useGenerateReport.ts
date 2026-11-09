import { useCallback, useState } from "react";
import { reportApi } from "../services/api";
import type { ReportFormat, ReportParams } from "../types";

export const useGenerateReport = () => {
  const [pendingFormat, setPendingFormat] = useState<ReportFormat | null>(null);

  const generate = useCallback(
    async (params: ReportParams, format: ReportFormat): Promise<Blob> => {
      setPendingFormat(format);
      try {
        return await reportApi.download(params, format);
      } finally {
        setPendingFormat(null);
      }
    },
    [],
  );

  return {
    generate,
    pendingFormat,
    isGenerating: pendingFormat !== null,
  };
};
