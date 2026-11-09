import { ReportPeriodKind } from "./types";

export const PERIOD_OPTIONS: Array<{ value: ReportPeriodKind; label: string }> =
  [
    { value: "monthly", label: "Mensual" },
    { value: "annual", label: "Anual" },
    { value: "custom", label: "Personalizado" },
  ];
