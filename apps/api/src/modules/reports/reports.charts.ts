import { formatCompactAmount, formatPercent } from "./reports.format";
import type { ReportCategoryTotal, ReportSeriesPoint } from "./reports.service";

export interface ChartBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CategoryChartItem {
  name: string;
  color: string;
  total: number;
}

const COLORS = {
  text: "#37474f",
  muted: "#78909c",
  grid: "#e0e0e0",
  axis: "#b0bec5",
  income: "#4caf50",
  expenses: "#e53935",
  balance: "#0050de",
  balanceFill: "#e8f1ff",
  track: "#eceff1",
  other: "#90a4ae",
};

const drawChartTitle = (
  doc: PDFKit.PDFDocument,
  box: ChartBox,
  title: string,
  width = box.width,
): void => {
  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor(COLORS.text)
    .text(title, box.x, box.y, {
      width,
      lineBreak: false,
      ellipsis: true,
    });
};

const drawEmptyChart = (
  doc: PDFKit.PDFDocument,
  box: ChartBox,
  message: string,
): void => {
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(message, box.x, box.y + 28, {
      width: box.width,
      align: "center",
      lineBreak: false,
    });
};

const drawLegend = (
  doc: PDFKit.PDFDocument,
  rightX: number,
  y: number,
  entries: Array<{ label: string; color: string }>,
): void => {
  let x = rightX;
  doc.font("Helvetica").fontSize(6).fillColor(COLORS.muted);

  for (const entry of entries) {
    doc.rect(x, y + 2, 6, 6).fill(entry.color);
    doc
      .fillColor(COLORS.muted)
      .text(entry.label, x + 9, y, { lineBreak: false });
    x += 13 + doc.widthOfString(entry.label) + 10;
  }
};

const niceMax = (value: number): number => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
};

const drawBar = (
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void => {
  if (height <= 0) return;
  if (height <= 2) {
    doc.rect(x, y, width, height).fill(color);
    return;
  }
  doc.roundedRect(x, y, width, height, Math.min(2, width / 2)).fill(color);
};

const labelStep = (count: number): number => {
  if (count > 20) return 5;
  if (count > 14) return 2;
  return 1;
};

export interface IncomeExpenseBarChartOptions {
  title: string;
  currency: string;
  points: ReportSeriesPoint[];
}

export const drawIncomeExpenseBarChart = (
  doc: PDFKit.PDFDocument,
  box: ChartBox,
  options: IncomeExpenseBarChartOptions,
): void => {
  doc.save();

  try {
    drawChartTitle(
      doc,
      box,
      `${options.title} · ${options.currency}`,
      box.width - 108,
    );
    drawLegend(doc, box.x + box.width - 102, box.y, [
      { label: "Ingresos", color: COLORS.income },
      { label: "Gastos", color: COLORS.expenses },
    ]);

    if (options.points.length === 0) {
      drawEmptyChart(doc, box, "Sin movimientos en el período");
      return;
    }

    const plotX = box.x + 42;
    const plotY = box.y + 24;
    const plotWidth = box.width - 48;
    const plotHeight = box.height - 46;
    const maxValue = Math.max(
      ...options.points.map((point) => Math.max(point.income, point.expenses)),
      1,
    );
    const axisMax = niceMax(maxValue);

    for (let index = 0; index <= 4; index += 1) {
      const value = (axisMax * index) / 4;
      const y = plotY + plotHeight - (plotHeight * index) / 4;

      doc
        .moveTo(plotX, y)
        .lineTo(plotX + plotWidth, y)
        .lineWidth(0.4)
        .strokeColor(COLORS.grid)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(COLORS.muted)
        .text(formatCompactAmount(value), plotX - 38, y - 3, {
          width: 34,
          align: "right",
          lineBreak: false,
        });
    }

    const groupWidth = plotWidth / options.points.length;
    const barWidth = Math.min(10, Math.max(3, groupWidth * 0.28));
    const gap = Math.max(1, barWidth * 0.25);

    options.points.forEach((point, index) => {
      const center = plotX + groupWidth * (index + 0.5);
      const incomeHeight = (point.income / axisMax) * plotHeight;
      const expensesHeight = (point.expenses / axisMax) * plotHeight;
      const baseY = plotY + plotHeight;

      drawBar(
        doc,
        center - barWidth - gap / 2,
        baseY - incomeHeight,
        barWidth,
        incomeHeight,
        COLORS.income,
      );
      drawBar(
        doc,
        center + gap / 2,
        baseY - expensesHeight,
        barWidth,
        expensesHeight,
        COLORS.expenses,
      );
    });

    doc
      .moveTo(plotX, plotY + plotHeight)
      .lineTo(plotX + plotWidth, plotY + plotHeight)
      .lineWidth(0.6)
      .strokeColor(COLORS.axis)
      .stroke();

    const step = labelStep(options.points.length);

    options.points.forEach((point, index) => {
      if (index % step !== 0) return;

      doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(COLORS.muted)
        .text(
          point.shortLabel,
          plotX + groupWidth * index,
          plotY + plotHeight + 5,
          {
            width: groupWidth,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          },
        );
    });
  } finally {
    doc.restore();
  }
};

export interface BalanceLineChartOptions {
  title: string;
  currency: string;
  points: ReportSeriesPoint[];
}

export const drawBalanceLineChart = (
  doc: PDFKit.PDFDocument,
  box: ChartBox,
  options: BalanceLineChartOptions,
): void => {
  doc.save();

  try {
    drawChartTitle(doc, box, `${options.title} · ${options.currency}`);

    if (options.points.length === 0) {
      drawEmptyChart(doc, box, "Sin movimientos en el período");
      return;
    }

    const values = options.points.map((point) => point.cumulative);
    const rawMin = Math.min(0, ...values);
    const rawMax = Math.max(0, ...values);
    const rawRange = rawMax - rawMin;
    const padding = rawRange === 0 ? 1 : rawRange * 0.12;
    const minValue = rawMin === 0 ? 0 : rawMin - padding;
    const maxValue = rawMax === 0 ? 1 : rawMax + padding;

    const plotX = box.x + 42;
    const plotY = box.y + 24;
    const plotWidth = box.width - 48;
    const plotHeight = box.height - 46;

    const yForValue = (value: number): number =>
      plotY +
      plotHeight -
      ((value - minValue) / (maxValue - minValue)) * plotHeight;

    for (let index = 0; index <= 4; index += 1) {
      const value = minValue + ((maxValue - minValue) * index) / 4;
      const y = yForValue(value);

      doc
        .moveTo(plotX, y)
        .lineTo(plotX + plotWidth, y)
        .lineWidth(0.4)
        .strokeColor(COLORS.grid)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(COLORS.muted)
        .text(formatCompactAmount(value), plotX - 38, y - 3, {
          width: 34,
          align: "right",
          lineBreak: false,
        });
    }

    const xForIndex = (index: number): number =>
      options.points.length === 1
        ? plotX + plotWidth / 2
        : plotX + (plotWidth * index) / (options.points.length - 1);

    const zeroY = yForValue(0);

    doc
      .save()
      .dash(2, { space: 2 })
      .moveTo(plotX, zeroY)
      .lineTo(plotX + plotWidth, zeroY)
      .lineWidth(0.5)
      .strokeColor(COLORS.axis)
      .stroke()
      .undash()
      .restore();

    doc.save();
    doc.moveTo(xForIndex(0), zeroY);
    options.points.forEach((point, index) => {
      doc.lineTo(xForIndex(index), yForValue(point.cumulative));
    });
    doc.lineTo(xForIndex(options.points.length - 1), zeroY);
    doc.closePath().fill(COLORS.balanceFill);
    doc.restore();

    doc.lineWidth(1.4).strokeColor(COLORS.balance);
    options.points.forEach((point, index) => {
      const x = xForIndex(index);
      const y = yForValue(point.cumulative);
      if (index === 0) doc.moveTo(x, y);
      else doc.lineTo(x, y);
    });
    doc.stroke();

    options.points.forEach((point, index) => {
      doc
        .circle(xForIndex(index), yForValue(point.cumulative), 1.7)
        .fill(COLORS.balance);
    });

    const step = labelStep(options.points.length);
    const groupWidth = plotWidth / Math.max(options.points.length, 1);

    options.points.forEach((point, index) => {
      if (index % step !== 0) return;

      doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(COLORS.muted)
        .text(
          point.shortLabel,
          xForIndex(index) - groupWidth / 2,
          plotY + plotHeight + 5,
          {
            width: groupWidth,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          },
        );
    });
  } finally {
    doc.restore();
  }
};

export interface CategoryBarsChartOptions {
  title: string;
  currency: string;
  items: ReportCategoryTotal[];
  emptyMessage: string;
  maxItems?: number;
}

const aggregateCategories = (
  items: ReportCategoryTotal[],
  maxItems: number,
): CategoryChartItem[] => {
  const sorted = [...items].sort((a, b) => b.total - a.total);
  const visible: CategoryChartItem[] = sorted
    .slice(0, maxItems)
    .map((item) => ({
      name: item.name,
      color: item.color,
      total: item.total,
    }));
  const rest = sorted.slice(maxItems);
  const restTotal = rest.reduce((sum, item) => sum + item.total, 0);

  if (restTotal > 0) {
    visible.push({
      name: "Otras",
      color: COLORS.other,
      total: restTotal,
    });
  }

  return visible;
};

export const drawCategoryBarsChart = (
  doc: PDFKit.PDFDocument,
  box: ChartBox,
  options: CategoryBarsChartOptions,
): void => {
  doc.save();

  try {
    drawChartTitle(
      doc,
      box,
      `${options.title} · ${options.currency}`,
      box.width - 8,
    );

    if (options.items.length === 0) {
      drawEmptyChart(doc, box, options.emptyMessage);
      return;
    }

    const items = aggregateCategories(options.items, options.maxItems ?? 6);
    const grandTotal = options.items.reduce((sum, item) => sum + item.total, 0);
    const maxTotal = Math.max(...items.map((item) => item.total), 1);
    const titleHeight = 20;
    const rowHeight = Math.min(
      20,
      (box.height - titleHeight) / Math.max(items.length, 1),
    );
    const labelWidth = box.width * 0.34;
    const valueWidth = 72;
    const barX = box.x + labelWidth;
    const barWidth = box.width - labelWidth - valueWidth - 8;

    items.forEach((item, index) => {
      const rowY = box.y + titleHeight + index * rowHeight;
      const barY = rowY + rowHeight / 2 - 4;
      const width = (item.total / maxTotal) * barWidth;
      const percent = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(COLORS.text)
        .text(item.name, box.x, rowY + 1, {
          width: labelWidth - 6,
          lineBreak: false,
          ellipsis: true,
        });

      doc.roundedRect(barX, barY, barWidth, 8, 4).fill(COLORS.track);

      if (width > 0) {
        doc.roundedRect(barX, barY, Math.max(2, width), 8, 4).fill(item.color);
      }

      doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(COLORS.muted)
        .text(
          `${formatCompactAmount(item.total)} (${formatPercent(percent)})`,
          box.x + box.width - valueWidth,
          rowY + 1,
          {
            width: valueWidth,
            align: "right",
            lineBreak: false,
            ellipsis: true,
          },
        );
    });
  } finally {
    doc.restore();
  }
};
