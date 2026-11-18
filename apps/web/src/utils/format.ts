import { es } from "date-fns/locale";
import {
  format as dateFnsFormat,
  isValid,
  parse,
  parseISO,
  subMonths,
} from "date-fns";
import { esCapitalized } from "./esCapitalized";

export const getCurrencySymbol = (currency: string): string => {
  const code = currency.toUpperCase();
  return code;
};

let decimalFormatter: Intl.NumberFormat | undefined;

const getDecimalFormatter = (): Intl.NumberFormat => {
  if (!decimalFormatter) {
    decimalFormatter = new Intl.NumberFormat("es-AR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return decimalFormatter;
};

export const formatCurrency = (amount: number, currency = "USD"): string => {
  const code = currency.toUpperCase();
  const symbol = getCurrencySymbol(code);
  return `${symbol} ${getDecimalFormatter().format(amount)}`;
};

export const formatDate = (
  date: string | Date,
  pattern = "dd/MM/yyyy",
): string => {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return dateFnsFormat(parsed, pattern, { locale: esCapitalized });
};

export const formatMonth = (date: Date): string =>
  dateFnsFormat(date, "LLLL yyyy", { locale: es });

export const today = (): string => dateFnsFormat(new Date(), "yyyy-MM-dd");

export const startOfMonth = (): string => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return dateFnsFormat(first, "yyyy-MM-dd");
};

export const formatAmountWithSign = (
  amount: number,
  currency: string,
  type: "income" | "expense",
): string => {
  const formatted = formatCurrency(amount, currency);
  return type === "income" ? `+ ${formatted}` : `- ${formatted}`;
};

export const getPreviousMonthRange = (
  anchor: Date,
): { from: string; to: string } => {
  const prev = subMonths(anchor, 1);
  const first = new Date(prev.getFullYear(), prev.getMonth(), 1);
  const last = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
  return {
    from: dateFnsFormat(first, "yyyy-MM-dd"),
    to: dateFnsFormat(last, "yyyy-MM-dd"),
  };
};

export const getPreviousMonth = (currentMonth: string): string => {
  const date = parse(currentMonth, "MMMM yyyy", new Date(), { locale: es });
  const prev = subMonths(date, 1);
  const prevMonthFormatted = dateFnsFormat(prev, "MMM yyyy", { locale: es });
  return (
    prevMonthFormatted.charAt(0).toUpperCase() + prevMonthFormatted.slice(1)
  );
};
