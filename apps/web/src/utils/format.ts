import { es } from "date-fns/locale";
import { format as dateFnsFormat, isValid, parseISO } from "date-fns";

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

const CURRENCY_SYMBOLS: Record<string, string> = {
  VED: "VED",
};

export const getCurrencySymbol = (currency: string): string => {
  const code = currency.toUpperCase();
  return CURRENCY_SYMBOLS[code] ?? code;
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

const getFormatter = (currency: string): Intl.NumberFormat => {
  const key = currency.toUpperCase();
  let formatter = currencyFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: key,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    currencyFormatterCache.set(key, formatter);
  }
  return formatter;
};

export const formatCurrency = (amount: number, currency = "USD"): string => {
  const code = currency.toUpperCase();
  const symbol = getCurrencySymbol(code);
  if (CURRENCY_SYMBOLS[code]) {
    return `${symbol} ${getDecimalFormatter().format(amount)}`;
  }
  return getFormatter(currency).format(amount);
};

export const formatDate = (
  date: string | Date,
  pattern = "dd/MM/yyyy",
): string => {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return dateFnsFormat(parsed, pattern, { locale: es });
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
