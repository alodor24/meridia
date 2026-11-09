import { useMemo, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useListAccounts } from "@/features/accounts/hooks/useListAccounts";
import { useListCategories } from "@/features/categories/hooks/useListCategories";
import { useGenerateReport } from "./useGenerateReport";
import {
  buildReportFilename,
  buildReportParams,
  buildYearOptions,
  defaultReportSelection,
  isCustomRangeInvalid,
} from "../utils/reportPeriod";
import type {
  ReportFilters as ReportFiltersValue,
  ReportSelection,
} from "../types";
import { toApiError } from "@/services/api/errors";

const useReports = () => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { data: user } = useCurrentUser();
  const { data: accounts = [] } = useListAccounts();
  const { data: categories = [] } = useListCategories();
  const { generate, pendingFormat, isGenerating } = useGenerateReport();

  const [selection, setSelection] = useState<ReportSelection>(() =>
    defaultReportSelection(),
  );

  const yearOptions = useMemo(
    () => buildYearOptions(user?.createdAt),
    [user?.createdAt],
  );

  const params = buildReportParams(selection);
  const isRangeInvalid = isCustomRangeInvalid(selection);
  const isBusy = isGenerating || isRangeInvalid;

  const updateSelection = (patch: Partial<ReportSelection>) => {
    setSelection((current) => ({ ...current, ...patch }));
  };

  const updateFilters = (filters: ReportFiltersValue) => {
    setSelection((current) => ({ ...current, filters }));
  };

  const handleViewPdf = async () => {
    if (isRangeInvalid) {
      showSnackbar(
        "La fecha desde no puede ser mayor que la fecha hasta.",
        "error",
      );
      return;
    }

    const tab = window.open("about:blank", "_blank");
    if (!tab) {
      showSnackbar(
        "Habilita las ventanas emergentes para ver el reporte en una nueva pestaña.",
        "error",
      );
      return;
    }

    tab.opener = null;

    try {
      const blob = await generate(params, "pdf");
      const url = URL.createObjectURL(blob);
      tab.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      showSnackbar("PDF generado. Se abrió en una nueva pestaña.");
    } catch (error) {
      tab.close();
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const handleDownloadCsv = async () => {
    if (isRangeInvalid) {
      showSnackbar(
        "La fecha desde no puede ser mayor que la fecha hasta.",
        "error",
      );
      return;
    }

    try {
      const blob = await generate(params, "csv");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = buildReportFilename(params, "csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      showSnackbar("CSV generado correctamente.");
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return {
    selection,
    yearOptions,
    accounts,
    categories,
    isRangeInvalid,
    isBusy,
    pendingFormat,
    updateSelection,
    updateFilters,
    handleViewPdf,
    handleDownloadCsv,
  };
};

export default useReports;
