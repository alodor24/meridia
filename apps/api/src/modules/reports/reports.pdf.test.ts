import { describe, expect, it } from "vitest";
import { buildTransactionsPdf } from "./reports.pdf";
import type { TransactionsReport } from "./reports.service";

const buildReport = (): TransactionsReport => ({
  user: { name: "Test", email: "test@example.com", currency: "ARS" },
  generatedAt: "2026-10-26T12:00:00.000Z",
  period: {
    kind: "annual",
    from: "2026-01-01",
    to: "2026-12-31",
    granularity: "month",
    label: "Año 2026",
    shortLabel: "2026",
  },
  filters: { accountName: "Caja", type: "expense" },
  movements: [
    {
      id: "t1" as never,
      date: "2026-01-10",
      type: "expense",
      amount: 500,
      note: "prueba",
      accountName: "Caja",
      accountCurrency: "ARS",
      categoryName: "Alimentos",
      categoryColor: "#e53935",
    },
  ],
  sections: [
    {
      currency: "ARS",
      movementCount: 1,
      totals: { income: 1000, expenses: 500, balance: 500 },
      series: Array.from({ length: 12 }, (_, index) => ({
        key: `2026-${String(index + 1).padStart(2, "0")}`,
        label: `Mes ${index + 1}`,
        shortLabel: `M${index + 1}`,
        income: index === 0 ? 1000 : 0,
        expenses: index === 0 ? 500 : 0,
        balance: index === 0 ? 500 : 0,
        cumulative: index === 0 ? 500 : 500,
      })),
      expensesByCategory: [
        {
          categoryId: "c1" as never,
          name: "Alimentos",
          color: "#e53935",
          total: 500,
          count: 1,
        },
      ],
      incomesByCategory: [],
    },
  ],
  showMovementTable: false,
});

describe("buildTransactionsPdf", () => {
  it("genera un PDF válido con gráficos y tablas", async () => {
    const pdf = await buildTransactionsPdf(buildReport());

    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.length).toBeGreaterThan(4000);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("genera un PDF válido cuando no hay movimientos", async () => {
    const report = buildReport();
    report.movements = [];
    report.sections = [];
    report.period.granularity = "day";

    const pdf = await buildTransactionsPdf(report);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
