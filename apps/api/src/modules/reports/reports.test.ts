import type { Stream } from "node:stream";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { truncateAll } from "../../test/db";
import { registerAndLogin } from "../../test/helpers";

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

interface SetupContext {
  agent: ReturnType<(typeof import("supertest"))["agent"]>;
  arsAccountId: string;
  usdAccountId: string;
  expenseCategoryId: string;
  incomeCategoryId: string;
}

const setupUser = async (): Promise<SetupContext> => {
  const { agent } = await registerAndLogin(app);

  const arsAccount = await agent
    .post("/api/accounts")
    .send({ name: "Caja", type: "cash", currency: "ARS" });
  const usdAccount = await agent
    .post("/api/accounts")
    .send({ name: "Dólares", type: "bank", currency: "USD" });
  const categories = await agent.get("/api/categories");

  const expenseCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === "expense",
  );
  const incomeCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === "income",
  );

  return {
    agent,
    arsAccountId: arsAccount.body.data.account.id as string,
    usdAccountId: usdAccount.body.data.account.id as string,
    expenseCategoryId: expenseCategory.id as string,
    incomeCategoryId: incomeCategory.id as string,
  };
};

const addTransaction = (
  ctx: SetupContext,
  overrides: Record<string, unknown> = {},
) =>
  ctx.agent.post("/api/transactions").send({
    accountId: ctx.arsAccountId,
    categoryId: ctx.expenseCategoryId,
    type: "expense",
    amount: 100,
    date: "2026-01-15",
    note: 'supermercado; con "comillas"',
    ...overrides,
  });

const binaryParser = (
  res: Stream,
  callback: (error: Error | null, body: Buffer) => void,
): void => {
  const chunks: Buffer[] = [];
  res.on("data", (chunk: Buffer) => chunks.push(chunk));
  res.on("end", () => callback(null, Buffer.concat(chunks)));
};

describe("GET /api/reports/transactions", () => {
  it("requiere autenticación", async () => {
    const response = await request(app).get(
      "/api/reports/transactions?format=csv&period=annual&year=2026",
    );
    expect(response.status).toBe(401);
  });

  it("genera un CSV mensual con los movimientos y filtros aplicados", async () => {
    const ctx = await setupUser();
    await addTransaction(ctx);
    await addTransaction(ctx, {
      accountId: ctx.usdAccountId,
      amount: 50,
      date: "2026-01-20",
      note: "USD",
    });
    await addTransaction(ctx, {
      type: "income",
      categoryId: ctx.incomeCategoryId,
      amount: 1000,
      date: "2026-02-01",
      note: "sueldo",
    });

    const response = await ctx.agent.get(
      "/api/reports/transactions?format=csv&period=monthly&year=2026&month=1",
    );

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.headers["content-disposition"]).toContain("attachment");
    expect(response.text.startsWith("\uFEFF")).toBe(true);
    expect(response.text).toContain(
      "Fecha;Tipo;Categoría;Cuenta;Moneda;Monto;Nota",
    );
    expect(response.text).toContain("ARS");
    expect(response.text).toContain("USD");
    expect(response.text.split("\r\n").filter(Boolean)).toHaveLength(3);
  });

  it("aplica los filtros de tipo y cuenta", async () => {
    const ctx = await setupUser();
    await addTransaction(ctx);
    await addTransaction(ctx, {
      accountId: ctx.usdAccountId,
      amount: 50,
      date: "2026-01-20",
    });
    await addTransaction(ctx, {
      type: "income",
      categoryId: ctx.incomeCategoryId,
      amount: 1000,
      date: "2026-01-25",
    });

    const incomes = await ctx.agent.get(
      "/api/reports/transactions?format=csv&period=monthly&year=2026&month=1&type=income",
    );
    expect(incomes.text).toContain("Ingreso");
    expect(incomes.text).not.toContain("Gasto");

    const usdOnly = await ctx.agent.get(
      `/api/reports/transactions?format=csv&period=monthly&year=2026&month=1&accountId=${ctx.usdAccountId}`,
    );
    expect(usdOnly.text).toContain("USD");
    expect(usdOnly.text).not.toContain("ARS");
  });

  it("genera el detalle completo del CSV anual", async () => {
    const ctx = await setupUser();
    await addTransaction(ctx);
    await addTransaction(ctx, {
      accountId: ctx.usdAccountId,
      amount: 50,
      date: "2026-02-20",
    });
    await addTransaction(ctx, {
      type: "income",
      categoryId: ctx.incomeCategoryId,
      amount: 1000,
      date: "2026-03-01",
    });
    await addTransaction(ctx, {
      amount: 20,
      date: "2025-12-31",
    });

    const response = await ctx.agent.get(
      "/api/reports/transactions?format=csv&period=annual&year=2026",
    );

    expect(response.status).toBe(200);
    expect(response.text.split("\r\n").filter(Boolean)).toHaveLength(4);
  });

  it("genera el PDF con disposición inline", async () => {
    const ctx = await setupUser();
    await addTransaction(ctx);

    const response = await ctx.agent
      .get(
        "/api/reports/transactions?format=pdf&period=monthly&year=2026&month=1",
      )
      .buffer(true)
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/pdf");
    expect(response.headers["content-disposition"]).toContain("inline");
    expect(Buffer.isBuffer(response.body)).toBe(true);
    expect((response.body as Buffer).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("genera un PDF anual con gráficos", async () => {
    const ctx = await setupUser();
    await addTransaction(ctx);
    await addTransaction(ctx, {
      type: "income",
      categoryId: ctx.incomeCategoryId,
      amount: 1000,
      date: "2026-06-01",
    });

    const response = await ctx.agent
      .get("/api/reports/transactions?format=pdf&period=annual&year=2026")
      .buffer(true)
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect((response.body as Buffer).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("valida el período y el rango personalizado", async () => {
    const ctx = await setupUser();

    const missingMonth = await ctx.agent.get(
      "/api/reports/transactions?format=csv&period=monthly&year=2026",
    );
    expect(missingMonth.status).toBe(400);

    const invertedRange = await ctx.agent.get(
      "/api/reports/transactions?format=csv&period=custom&from=2026-02-01&to=2026-01-01",
    );
    expect(invertedRange.status).toBe(400);

    const invalidFormat = await ctx.agent.get(
      "/api/reports/transactions?format=xlsx&period=annual&year=2026",
    );
    expect(invalidFormat.status).toBe(400);
  });
});
