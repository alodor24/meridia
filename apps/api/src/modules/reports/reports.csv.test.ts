import { describe, expect, it } from "vitest";
import { buildTransactionsCsv } from "./reports.csv";
import type { TransactionsReport } from "./reports.service";

const buildReport = (): TransactionsReport => ({
  user: { name: "Test", email: "test@example.com", currency: "ARS" },
  generatedAt: "2026-10-26T12:00:00.000Z",
  period: {
    kind: "monthly",
    from: "2026-10-01",
    to: "2026-10-31",
    granularity: "day",
    label: "Octubre 2026",
    shortLabel: "2026-10",
  },
  filters: {},
  movements: [
    {
      id: "t1" as never,
      date: "2026-10-05",
      type: "expense",
      amount: 1234.5,
      note: 'supermercado; con "comillas"',
      accountName: "Caja",
      accountCurrency: "ARS",
      categoryName: "Alimentos",
      categoryColor: "#e53935",
    },
    {
      id: "t2" as never,
      date: "2026-10-06",
      type: "income",
      amount: 2500,
      note: "=SUM(1;2)",
      accountName: "Banco",
      accountCurrency: "ARS",
      categoryName: "Salario",
      categoryColor: "#4caf50",
    },
  ],
  sections: [],
  showMovementTable: true,
});

describe("buildTransactionsCsv", () => {
  it("incluye BOM, encabezados y filas con formato es-AR", () => {
    const csv = buildTransactionsCsv(buildReport());

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Fecha;Tipo;Categoría;Cuenta;Moneda;Monto;Nota\r\n");
    expect(csv).toContain("05/10/2026;Gasto;Alimentos;Caja;ARS;1234,50;");
    expect(csv).toContain("06/10/2026;Ingreso;Salario;Banco;ARS;2500,00;");
  });

  it("escapa delimitadores, comillas y fórmulas", () => {
    const csv = buildTransactionsCsv(buildReport());

    expect(csv).toContain('"supermercado; con ""comillas"""');
    expect(csv).toContain("'=SUM(1;2)");
  });
});
