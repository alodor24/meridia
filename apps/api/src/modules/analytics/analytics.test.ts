import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { truncateAll } from "../../test/db";
import { registerAndLogin } from "../../test/helpers";

const app = createApp();

beforeEach(async () => {
  await truncateAll();
});

const setupUser = async () => {
  const { agent } = await registerAndLogin(app);

  const account = await agent
    .post("/api/accounts")
    .send({ name: "Caja", type: "cash", currency: "ARS" });
  const accountId = account.body.data.account.id as string;
  const categories = await agent.get("/api/categories");
  const expenseCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === "expense",
  );
  const incomeCategory = categories.body.data.items.find(
    (category: { type: string }) => category.type === "income",
  );

  const add = (type: "expense" | "income", amount: number, date: string) =>
    agent.post("/api/transactions").send({
      accountId,
      categoryId: type === "income" ? incomeCategory.id : expenseCategory.id,
      type,
      amount,
      date,
    });

  await add("expense", 400, "2026-01-15");
  await add("income", 1000, "2026-02-01");
  await add("expense", 100, "2026-04-15");
  await add("income", 500, "2026-05-01");
  await add("expense", 200, "2026-11-01");
  await add("expense", 50, "2025-12-01");

  return agent;
};

describe("GET /api/analytics", () => {
  it("agrega ingresos, gastos, categorías y trimestres del año", async () => {
    const agent = await setupUser();

    const response = await agent.get("/api/analytics?year=2026");
    expect(response.status).toBe(200);

    const analytics = response.body.data.analytics;
    expect(analytics.year).toBe(2026);
    expect(analytics.totalIncome).toBe(1500);
    expect(analytics.totalExpenses).toBe(700);
    expect(analytics.balance).toBe(800);

    expect(analytics.monthly).toHaveLength(12);
    expect(analytics.monthly[0]).toEqual({
      month: 1,
      income: 0,
      expenses: 400,
      balance: -400,
    });
    expect(analytics.monthly[1]).toEqual({
      month: 2,
      income: 1000,
      expenses: 0,
      balance: 1000,
    });
    expect(analytics.monthly[10]).toEqual({
      month: 11,
      income: 0,
      expenses: 200,
      balance: -200,
    });

    expect(analytics.quarterly).toHaveLength(4);
    expect(analytics.quarterly[0]).toEqual({
      quarter: 1,
      income: 1000,
      expenses: 400,
      balance: 600,
    });
    expect(analytics.quarterly[1]).toEqual({
      quarter: 2,
      income: 500,
      expenses: 100,
      balance: 400,
    });
    expect(analytics.quarterly[2]).toEqual({
      quarter: 3,
      income: 0,
      expenses: 0,
      balance: 0,
    });
    expect(analytics.quarterly[3]).toEqual({
      quarter: 4,
      income: 0,
      expenses: 200,
      balance: -200,
    });

    expect(analytics.expensesByCategory).toHaveLength(1);
    expect(analytics.expensesByCategory[0].total).toBe(700);
    expect(analytics.incomesByCategory).toHaveLength(1);
    expect(analytics.incomesByCategory[0].total).toBe(1500);

    expect(analytics.availableYears.min).toBe(2025);
    expect(analytics.availableYears.max).toBe(
      Math.max(2026, new Date().getFullYear()),
    );
  });

  it("filtra por el año solicitado", async () => {
    const agent = await setupUser();

    const response = await agent.get("/api/analytics?year=2025");
    expect(response.status).toBe(200);

    const analytics = response.body.data.analytics;
    expect(analytics.year).toBe(2025);
    expect(analytics.totalIncome).toBe(0);
    expect(analytics.totalExpenses).toBe(50);
    expect(analytics.monthly[11]).toEqual({
      month: 12,
      income: 0,
      expenses: 50,
      balance: -50,
    });
  });

  it("usa el año actual cuando no se envía el parámetro", async () => {
    const agent = await setupUser();

    const response = await agent.get("/api/analytics");
    expect(response.status).toBe(200);
    expect(response.body.data.analytics.year).toBe(new Date().getFullYear());
  });

  it("rechaza un año inválido", async () => {
    const agent = await setupUser();

    const response = await agent.get("/api/analytics?year=1800");
    expect(response.status).toBe(400);
  });

  it("requiere autenticación", async () => {
    const response = await request(app).get("/api/analytics?year=2026");
    expect(response.status).toBe(401);
  });
});
