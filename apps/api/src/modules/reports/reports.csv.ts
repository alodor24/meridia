import { formatDateEs } from "./reports.period";
import type { ReportMovement, TransactionsReport } from "./reports.service";

export const CSV_DELIMITER = ";";

const HEADERS = [
  "Fecha",
  "Tipo",
  "Categoría",
  "Cuenta",
  "Moneda",
  "Monto",
  "Nota",
];

const sanitizeFormula = (value: string): string =>
  /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

const escapeCell = (value: string): string => {
  const sanitized = sanitizeFormula(value);
  if (
    sanitized.includes(CSV_DELIMITER) ||
    sanitized.includes('"') ||
    sanitized.includes("\n") ||
    sanitized.includes("\r")
  ) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
};

const formatAmount = (amount: number): string =>
  amount.toFixed(2).replace(".", ",");

const typeLabel = (type: ReportMovement["type"]): string =>
  type === "income" ? "Ingreso" : "Gasto";

const movementToRow = (movement: ReportMovement): string =>
  [
    formatDateEs(movement.date),
    typeLabel(movement.type),
    movement.categoryName,
    movement.accountName,
    movement.accountCurrency,
    formatAmount(movement.amount),
    movement.note ?? "",
  ]
    .map(escapeCell)
    .join(CSV_DELIMITER);

export const buildTransactionsCsv = (report: TransactionsReport): string => {
  const lines = [HEADERS.join(CSV_DELIMITER)];
  lines.push(...report.movements.map(movementToRow));
  return `\uFEFF${lines.join("\r\n")}\r\n`;
};
