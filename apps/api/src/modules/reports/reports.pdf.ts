import PDFDocument from "pdfkit";
import {
  drawBalanceLineChart,
  drawCategoryBarsChart,
  drawIncomeExpenseBarChart,
  type ChartBox,
} from "./reports.charts";
import { formatAmount, formatAmountPlain } from "./reports.format";
import {
  formatDateEs,
  formatDateTimeEs,
  reportKindLabel,
} from "./reports.period";
import type {
  ReportCurrencySection,
  ReportMovement,
  TransactionsReport,
} from "./reports.service";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 46;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - 52;
const CONTINUATION_TOP = 58;

const COLORS = {
  primary: "#0050de",
  text: "#37474f",
  muted: "#78909c",
  divider: "#e0e0e0",
  panel: "#f5f7fa",
  row: "#f7f9fc",
  white: "#ffffff",
  income: "#2e7d32",
  expenses: "#c62828",
  balance: "#0050de",
  negative: "#c62828",
};

const summaryCardWidth = (CONTENT_WIDTH - 20) / 3;

const filterLine = (report: TransactionsReport): string => {
  const type =
    report.filters.type === "income"
      ? "Ingresos"
      : report.filters.type === "expense"
        ? "Gastos"
        : "Todos";

  return [
    `Cuenta: ${report.filters.accountName ?? "Todas"}`,
    `Categoría: ${report.filters.categoryName ?? "Todas"}`,
    `Tipo: ${type}`,
  ].join("  ·  ");
};

const drawFirstPageHeader = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
): number => {
  doc.rect(0, 0, PAGE_WIDTH, 8).fill(COLORS.primary);

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(COLORS.primary)
    .text("Meridia", MARGIN, 32, { lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text("Finanzas personales", MARGIN, 58, { lineBreak: false });

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(COLORS.text)
    .text(`Reporte ${reportKindLabel(report.period.kind)}`, MARGIN, 34, {
      width: CONTENT_WIDTH,
      align: "right",
      lineBreak: false,
    });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(report.period.label, MARGIN, 54, {
      width: CONTENT_WIDTH,
      align: "right",
      lineBreak: false,
    });

  doc
    .moveTo(MARGIN, 78)
    .lineTo(PAGE_WIDTH - MARGIN, 78)
    .lineWidth(0.6)
    .strokeColor(COLORS.divider)
    .stroke();

  doc.roundedRect(MARGIN, 90, CONTENT_WIDTH, 50, 7).fill(COLORS.panel);

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.text)
    .text(`Período: ${report.period.label}`, MARGIN + 10, 98, {
      width: CONTENT_WIDTH - 20,
      lineBreak: false,
    });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(filterLine(report), MARGIN + 10, 111, {
      width: CONTENT_WIDTH - 20,
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(
      `Generado por ${report.user.name} (${report.user.email}) el ${formatDateTimeEs(report.generatedAt)}  ·  ${formatMovementCount(report.movements.length)}`,
      MARGIN + 10,
      124,
      {
        width: CONTENT_WIDTH - 20,
        lineBreak: false,
        ellipsis: true,
      },
    );

  return 154;
};

const formatMovementCount = (count: number): string =>
  `${count} ${count === 1 ? "movimiento" : "movimientos"}`;

const drawContinuationHeader = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
): number => {
  doc.rect(0, 0, PAGE_WIDTH, 6).fill(COLORS.primary);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(COLORS.primary)
    .text("Meridia", MARGIN, 26, { lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(
      `Reporte ${reportKindLabel(report.period.kind)} · ${report.period.label}`,
      MARGIN,
      26,
      {
        width: CONTENT_WIDTH,
        align: "right",
        lineBreak: false,
        ellipsis: true,
      },
    );

  doc
    .moveTo(MARGIN, 40)
    .lineTo(PAGE_WIDTH - MARGIN, 40)
    .lineWidth(0.5)
    .strokeColor(COLORS.divider)
    .stroke();

  return CONTINUATION_TOP;
};

const ensureSpace = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
  y: number,
  height: number,
): number => {
  if (y + height <= BOTTOM_LIMIT) return y;
  doc.addPage();
  return drawContinuationHeader(doc, report);
};

const drawSummaryCard = (
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  label: string,
  value: string,
  color: string,
): void => {
  doc.roundedRect(x, y, summaryCardWidth, 48, 6).fill(COLORS.panel);

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(label, x + 10, y + 9, {
      width: summaryCardWidth - 20,
      lineBreak: false,
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor(color)
    .text(value, x + 10, y + 24, {
      width: summaryCardWidth - 20,
      lineBreak: false,
      ellipsis: true,
    });
};

const drawSummaryCards = (
  doc: PDFKit.PDFDocument,
  section: ReportCurrencySection,
  y: number,
): number => {
  drawSummaryCard(
    doc,
    MARGIN,
    y,
    "Ingresos",
    formatAmount(section.totals.income, section.currency),
    COLORS.income,
  );
  drawSummaryCard(
    doc,
    MARGIN + summaryCardWidth + 10,
    y,
    "Gastos",
    formatAmount(section.totals.expenses, section.currency),
    COLORS.expenses,
  );
  drawSummaryCard(
    doc,
    MARGIN + (summaryCardWidth + 10) * 2,
    y,
    "Balance",
    formatAmount(section.totals.balance, section.currency),
    section.totals.balance < 0 ? COLORS.negative : COLORS.balance,
  );

  return y + 58;
};

const drawCurrencyHeader = (
  doc: PDFKit.PDFDocument,
  section: ReportCurrencySection,
  y: number,
  visible: boolean,
): number => {
  if (!visible) return y;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.primary)
    .text(`Moneda ${section.currency}`, MARGIN, y, {
      lineBreak: false,
    });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(COLORS.muted)
    .text(formatMovementCount(section.movementCount), MARGIN, y + 1, {
      width: CONTENT_WIDTH,
      align: "right",
      lineBreak: false,
    });

  doc
    .moveTo(MARGIN, y + 18)
    .lineTo(PAGE_WIDTH - MARGIN, y + 18)
    .lineWidth(0.4)
    .strokeColor(COLORS.divider)
    .stroke();

  return y + 28;
};

const MOVEMENT_COLUMNS = [
  { label: "Fecha", width: 52, align: "left" as const },
  { label: "Tipo", width: 42, align: "left" as const },
  { label: "Categoría", width: 102, align: "left" as const },
  { label: "Cuenta", width: 98, align: "left" as const },
  { label: "Moneda", width: 38, align: "left" as const },
  { label: "Monto", width: 74, align: "right" as const },
  { label: "Nota", width: 97.28, align: "left" as const },
];

const columnX = (index: number): number =>
  MARGIN +
  MOVEMENT_COLUMNS.slice(0, index).reduce(
    (sum, column) => sum + column.width,
    0,
  );

const drawMovementTableHeader = (
  doc: PDFKit.PDFDocument,
  y: number,
): number => {
  doc.rect(MARGIN, y, CONTENT_WIDTH, 20).fill(COLORS.primary);

  MOVEMENT_COLUMNS.forEach((column, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(6.8)
      .fillColor(COLORS.white)
      .text(column.label, columnX(index) + 5, y + 7, {
        width: column.width - 10,
        align: column.align,
        lineBreak: false,
        ellipsis: true,
      });
  });

  return y + 20;
};

const typeLabel = (movement: ReportMovement): string =>
  movement.type === "income" ? "Ingreso" : "Gasto";

const drawMovementRow = (
  doc: PDFKit.PDFDocument,
  movement: ReportMovement,
  y: number,
  index: number,
): number => {
  const rowHeight = 17;

  if (index % 2 === 0) {
    doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill(COLORS.row);
  }

  const textY = y + 5;
  const amount = `${movement.type === "income" ? "+" : "-"} ${formatAmountPlain(movement.amount)}`;

  doc
    .font("Helvetica")
    .fontSize(6.5)
    .fillColor(COLORS.text)
    .text(formatDateEs(movement.date), columnX(0) + 5, textY, {
      width: MOVEMENT_COLUMNS[0]!.width - 10,
      lineBreak: false,
    });

  doc
    .fillColor(movement.type === "income" ? COLORS.income : COLORS.expenses)
    .text(typeLabel(movement), columnX(1) + 5, textY, {
      width: MOVEMENT_COLUMNS[1]!.width - 10,
      lineBreak: false,
    });

  doc
    .circle(columnX(2) + 9, y + rowHeight / 2, 2.2)
    .fill(movement.categoryColor);

  doc
    .font("Helvetica")
    .fontSize(6.5)
    .fillColor(COLORS.text)
    .text(movement.categoryName, columnX(2) + 15, textY, {
      width: MOVEMENT_COLUMNS[2]!.width - 20,
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .text(movement.accountName, columnX(3) + 5, textY, {
      width: MOVEMENT_COLUMNS[3]!.width - 10,
      lineBreak: false,
      ellipsis: true,
    })
    .text(movement.accountCurrency, columnX(4) + 5, textY, {
      width: MOVEMENT_COLUMNS[4]!.width - 10,
      lineBreak: false,
    });

  doc
    .fillColor(movement.type === "income" ? COLORS.income : COLORS.expenses)
    .text(amount, columnX(5) + 5, textY, {
      width: MOVEMENT_COLUMNS[5]!.width - 10,
      align: "right",
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .fontSize(6.3)
    .text(movement.note ?? "", columnX(6) + 5, textY, {
      width: MOVEMENT_COLUMNS[6]!.width - 10,
      lineBreak: false,
      ellipsis: true,
    });

  doc
    .moveTo(MARGIN, y + rowHeight)
    .lineTo(PAGE_WIDTH - MARGIN, y + rowHeight)
    .lineWidth(0.3)
    .strokeColor(COLORS.divider)
    .stroke();

  return y + rowHeight;
};

const drawMovementsTable = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
  section: ReportCurrencySection,
  y: number,
): number => {
  y = ensureSpace(doc, report, y, 48);

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Detalle de movimientos (${section.movementCount})`, MARGIN, y, {
      lineBreak: false,
    });

  y += 18;
  y = drawMovementTableHeader(doc, y);

  const movements = report.movements.filter(
    (movement) => movement.accountCurrency === section.currency,
  );

  movements.forEach((movement, index) => {
    if (y + 17 > BOTTOM_LIMIT) {
      doc.addPage();
      y = drawContinuationHeader(doc, report);
      y = drawMovementTableHeader(doc, y);
    }
    y = drawMovementRow(doc, movement, y, index);
  });

  return y + 8;
};

const SUMMARY_COLUMNS = [
  { label: "Período", width: CONTENT_WIDTH * 0.4, align: "left" as const },
  { label: "Ingresos", width: CONTENT_WIDTH * 0.2, align: "right" as const },
  { label: "Gastos", width: CONTENT_WIDTH * 0.2, align: "right" as const },
  { label: "Balance", width: CONTENT_WIDTH * 0.2, align: "right" as const },
];

const summaryColumnX = (index: number): number =>
  MARGIN +
  SUMMARY_COLUMNS.slice(0, index).reduce(
    (sum, column) => sum + column.width,
    0,
  );

const drawSummaryTableHeader = (
  doc: PDFKit.PDFDocument,
  title: string,
  y: number,
): number => {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`${title}`, MARGIN, y, {
      lineBreak: false,
    });

  y += 18;

  doc.rect(MARGIN, y, CONTENT_WIDTH, 20).fill(COLORS.primary);

  SUMMARY_COLUMNS.forEach((column, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(6.8)
      .fillColor(COLORS.white)
      .text(column.label, summaryColumnX(index) + 5, y + 7, {
        width: column.width - 10,
        align: column.align,
        lineBreak: false,
      });
  });

  return y + 20;
};

const drawSummaryTable = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
  section: ReportCurrencySection,
  y: number,
): number => {
  y = ensureSpace(doc, report, y, 60);

  const title =
    report.period.granularity === "year"
      ? `Resumen anual · ${section.currency}`
      : `Resumen mensual · ${section.currency}`;

  y = drawSummaryTableHeader(doc, title, y);

  section.series.forEach((point, index) => {
    if (y + 16 > BOTTOM_LIMIT) {
      doc.addPage();
      y = drawContinuationHeader(doc, report);
      y = drawSummaryTableHeader(doc, title, y);
    }

    if (index % 2 === 0) {
      doc.rect(MARGIN, y, CONTENT_WIDTH, 16).fill(COLORS.row);
    }

    const textY = y + 4.5;

    doc
      .font("Helvetica")
      .fontSize(6.8)
      .fillColor(COLORS.text)
      .text(point.label, summaryColumnX(0) + 5, textY, {
        width: SUMMARY_COLUMNS[0]!.width - 10,
        lineBreak: false,
        ellipsis: true,
      })
      .fillColor(COLORS.income)
      .text(formatAmountPlain(point.income), summaryColumnX(1) + 5, textY, {
        width: SUMMARY_COLUMNS[1]!.width - 10,
        align: "right",
        lineBreak: false,
        ellipsis: true,
      })
      .fillColor(COLORS.expenses)
      .text(formatAmountPlain(point.expenses), summaryColumnX(2) + 5, textY, {
        width: SUMMARY_COLUMNS[2]!.width - 10,
        align: "right",
        lineBreak: false,
        ellipsis: true,
      })
      .fillColor(point.balance < 0 ? COLORS.negative : COLORS.balance)
      .text(formatAmountPlain(point.balance), summaryColumnX(3) + 5, textY, {
        width: SUMMARY_COLUMNS[3]!.width - 10,
        align: "right",
        lineBreak: false,
        ellipsis: true,
      });

    doc
      .moveTo(MARGIN, y + 16)
      .lineTo(PAGE_WIDTH - MARGIN, y + 16)
      .lineWidth(0.3)
      .strokeColor(COLORS.divider)
      .stroke();

    y += 16;
  });

  return y + 8;
};

const drawNoData = (doc: PDFKit.PDFDocument, y: number): void => {
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 80, 8).fill(COLORS.panel);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      "No hay movimientos para el período y los filtros seleccionados.",
      MARGIN + 16,
      y + 34,
      {
        width: CONTENT_WIDTH - 32,
        align: "center",
        lineBreak: false,
      },
    );
};

const drawCurrencySection = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
  section: ReportCurrencySection,
  initialY: number,
): number => {
  let y = drawCurrencyHeader(
    doc,
    section,
    initialY,
    report.sections.length > 1,
  );

  y = drawSummaryCards(doc, section, y);

  const chartWidth = CONTENT_WIDTH;
  y = ensureSpace(doc, report, y, 180);
  drawIncomeExpenseBarChart(
    doc,
    { x: MARGIN, y, width: chartWidth, height: 180 },
    {
      title:
        report.period.granularity === "day"
          ? "Ingresos y gastos por día"
          : report.period.granularity === "month"
            ? "Ingresos y gastos por mes"
            : "Ingresos y gastos por año",
      currency: section.currency,
      points: section.series,
    },
  );
  y += 188;

  y = ensureSpace(doc, report, y, 150);
  drawBalanceLineChart(
    doc,
    { x: MARGIN, y, width: chartWidth, height: 150 },
    {
      title: "Balance acumulado del período",
      currency: section.currency,
      points: section.series,
    },
  );
  y += 158;

  const categoryGap = 12;
  const categoryWidth = (CONTENT_WIDTH - categoryGap) / 2;
  const categoryRows = Math.min(
    7,
    Math.max(
      section.expensesByCategory.length,
      section.incomesByCategory.length,
      1,
    ),
  );
  const categoryHeight = 28 + categoryRows * 20;
  y = ensureSpace(doc, report, y, categoryHeight);

  drawCategoryBarsChart(
    doc,
    { x: MARGIN, y, width: categoryWidth, height: categoryHeight },
    {
      title: "Gastos por categoría",
      currency: section.currency,
      items: section.expensesByCategory,
      emptyMessage: "Sin gastos en el período",
    },
  );

  drawCategoryBarsChart(
    doc,
    {
      x: MARGIN + categoryWidth + categoryGap,
      y,
      width: categoryWidth,
      height: categoryHeight,
    },
    {
      title: "Ingresos por categoría",
      currency: section.currency,
      items: section.incomesByCategory,
      emptyMessage: "Sin ingresos en el período",
    },
  );

  y += categoryHeight + 10;

  return report.showMovementTable
    ? drawMovementsTable(doc, report, section, y)
    : drawSummaryTable(doc, report, section, y);
};

const drawPageNumbers = (doc: PDFKit.PDFDocument): void => {
  const range = doc.bufferedPageRange();
  const total = range.count;

  for (let index = range.start; index < range.start + total; index += 1) {
    doc.switchToPage(index);

    doc
      .moveTo(MARGIN, PAGE_HEIGHT - 38)
      .lineTo(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 38)
      .lineWidth(0.4)
      .strokeColor(COLORS.divider)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(6.5)
      .fillColor(COLORS.muted)
      .text("Meridia · Reporte de movimientos", MARGIN, PAGE_HEIGHT - 28, {
        lineBreak: false,
      });

    doc.text(`Página ${index + 1} de ${total}`, MARGIN, PAGE_HEIGHT - 28, {
      width: CONTENT_WIDTH,
      align: "right",
      lineBreak: false,
    });
  }
};

const renderReport = (
  doc: PDFKit.PDFDocument,
  report: TransactionsReport,
): void => {
  let y = drawFirstPageHeader(doc, report);

  if (report.sections.length === 0) {
    drawNoData(doc, y);
    return;
  }

  report.sections.forEach((section, index) => {
    if (index > 0) {
      doc.addPage();
      y = drawContinuationHeader(doc, report);
    }
    y = drawCurrencySection(doc, report, section, y);
  });
};

export const buildTransactionsPdf = (
  report: TransactionsReport,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      bufferPages: true,
      info: {
        Title: `Reporte ${reportKindLabel(report.period.kind)} · ${report.period.label}`,
        Author: "Meridia",
        Subject: "Reporte de movimientos",
        Creator: "Meridia",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      renderReport(doc, report);
      drawPageNumbers(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });

export type { ChartBox };
