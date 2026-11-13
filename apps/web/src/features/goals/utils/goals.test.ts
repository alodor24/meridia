import { describe, expect, it } from "vitest";
import type { Account, AccountId, Goal, GoalId, UserId } from "@meridia/shared";
import {
  canContributeToGoal,
  getGoalAvailableAmount,
  getGoalProgress,
  getGoalRemainingAmount,
  getGoalReservedAmount,
  getGoalSavingsAccounts,
  getGoalSourceAccounts,
  splitGoals,
} from "./goals";

const buildAccount = (overrides: Partial<Account> = {}): Account => ({
  id: "account-1" as AccountId,
  userId: "user-1" as UserId,
  name: "Cuenta",
  type: "bank",
  currency: "ARS",
  balance: 1000,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const buildGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: "goal-1" as GoalId,
  userId: "user-1" as UserId,
  accountId: "account-1" as AccountId,
  accountName: "Ahorro",
  currency: "ARS",
  name: "Auto",
  description: null,
  targetAmount: 1000,
  currentAmount: 250,
  targetDate: null,
  icon: null,
  color: "#2e7d32",
  status: "active",
  completedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("getGoalProgress", () => {
  it("calcula el porcentaje redondeado y lo limita entre 0 y 100", () => {
    expect(getGoalProgress(buildGoal({ currentAmount: 250 }))).toBe(25);
    expect(getGoalProgress(buildGoal({ currentAmount: 1250 }))).toBe(100);
    expect(getGoalProgress(buildGoal({ currentAmount: -50 }))).toBe(0);
    expect(getGoalProgress(buildGoal({ targetAmount: 0 }))).toBe(0);
  });
});

describe("getGoalRemainingAmount", () => {
  it("no devuelve montos negativos", () => {
    expect(getGoalRemainingAmount(buildGoal({ currentAmount: 250 }))).toBe(750);
    expect(getGoalRemainingAmount(buildGoal({ currentAmount: 1500 }))).toBe(0);
  });
});

describe("splitGoals", () => {
  it("separa metas activas y completadas", () => {
    const active = buildGoal();
    const completed = buildGoal({
      id: "goal-2" as GoalId,
      status: "completed",
      completedAt: "2026-02-01T00:00:00.000Z",
    });

    expect(splitGoals([active, completed])).toEqual({
      active: [active],
      completed: [completed],
    });
  });
});

describe("cuentas de metas", () => {
  it("solo considera cuentas de ahorro para vincular metas", () => {
    const savings = buildAccount({ type: "savings" });
    const bank = buildAccount({ type: "bank" });

    expect(getGoalSavingsAccounts([savings, bank])).toEqual([savings]);
  });

  it("filtra cuentas de origen válidas para aportar", () => {
    const goal = buildGoal({ accountId: "goal-account" as AccountId });
    const valid = buildAccount({ id: "valid" as AccountId });
    const sameAccount = buildAccount({ id: "goal-account" as AccountId });
    const otherCurrency = buildAccount({
      id: "usd" as AccountId,
      currency: "USD",
    });
    const empty = buildAccount({ id: "empty" as AccountId, balance: 0 });
    const creditCard = buildAccount({
      id: "card" as AccountId,
      type: "credit_card",
    });

    expect(
      getGoalSourceAccounts(
        [valid, sameAccount, otherCurrency, empty, creditCard],
        goal,
      ),
    ).toEqual([valid]);
  });
});

describe("reservas de metas", () => {
  it("suma solo las metas activas de la cuenta", () => {
    const goals = [
      buildGoal({ currentAmount: 250 }),
      buildGoal({ id: "goal-2" as GoalId, currentAmount: 300 }),
      buildGoal({
        id: "goal-3" as GoalId,
        currentAmount: 500,
        status: "completed",
      }),
      buildGoal({
        id: "goal-4" as GoalId,
        accountId: "other-account" as AccountId,
        currentAmount: 100,
      }),
    ];

    expect(getGoalReservedAmount(goals, "account-1")).toBe(550);
  });

  it("calcula el disponible descontando reservas sin bajar de cero", () => {
    const account = buildAccount({ balance: 1000 });
    const goals = [
      buildGoal({ currentAmount: 250 }),
      buildGoal({ id: "goal-2" as GoalId, currentAmount: 300 }),
    ];

    expect(getGoalAvailableAmount(account, goals)).toBe(450);
    expect(getGoalAvailableAmount(buildAccount({ balance: 100 }), goals)).toBe(
      0,
    );
    expect(getGoalAvailableAmount(undefined, goals)).toBe(0);
  });

  it("permite aportar con saldo interno o desde otra cuenta", () => {
    const savings = buildAccount({
      id: "savings" as AccountId,
      type: "savings",
    });
    const bank = buildAccount({ id: "bank" as AccountId, balance: 500 });
    const goal = buildGoal({
      accountId: "savings" as AccountId,
      currentAmount: 250,
    });

    expect(canContributeToGoal([savings, bank], [goal], goal)).toBe(true);
  });

  it("no permite aportar si no hay saldo disponible ni cuentas externas", () => {
    const savings = buildAccount({
      id: "savings" as AccountId,
      type: "savings",
      balance: 250,
    });
    const goal = buildGoal({
      accountId: "savings" as AccountId,
      currentAmount: 250,
    });

    expect(canContributeToGoal([savings], [goal], goal)).toBe(false);
  });

  it("no permite aportar si las cuentas externas están totalmente reservadas", () => {
    const savings = buildAccount({
      id: "savings" as AccountId,
      type: "savings",
      balance: 1000,
    });
    const bank = buildAccount({ id: "bank" as AccountId, balance: 500 });
    const goal = buildGoal({
      accountId: "savings" as AccountId,
      currentAmount: 1000,
    });
    const bankGoal = buildGoal({
      id: "bank-goal" as GoalId,
      accountId: "bank" as AccountId,
      currentAmount: 500,
    });

    expect(canContributeToGoal([savings, bank], [goal, bankGoal], goal)).toBe(
      false,
    );
  });

  it("no permite aportar a una meta completada", () => {
    const savings = buildAccount({
      id: "savings" as AccountId,
      type: "savings",
      balance: 1000,
    });
    const goal = buildGoal({
      accountId: "savings" as AccountId,
      status: "completed",
      currentAmount: 1000,
    });

    expect(canContributeToGoal([savings], [goal], goal)).toBe(false);
  });
});
