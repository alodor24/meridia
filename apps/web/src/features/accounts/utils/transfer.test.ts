import { describe, expect, it } from "vitest";
import type { Account } from "@meridia/shared";
import {
  getDestinationAccounts,
  getInitialTransferValues,
  getSourceAccounts,
  isTransferableAccount,
  toAccountOption,
  toCreateTransferPayload,
} from "./transfer";

const now = new Date().toISOString();

const createAccount = (overrides: Partial<Account> = {}): Account => ({
  id: "account" as Account["id"],
  userId: "user" as Account["userId"],
  name: "Cuenta",
  type: "bank",
  currency: "ARS",
  balance: 1000,
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

const source = createAccount({
  id: "source" as Account["id"],
  name: "Banco",
  balance: 1000,
});

const destination = createAccount({
  id: "destination" as Account["id"],
  name: "Billetera",
  type: "wallet",
  balance: 200,
});

describe("isTransferableAccount", () => {
  it("acepta efectivo, banco, billetera y ahorro", () => {
    expect(isTransferableAccount(createAccount({ type: "cash" }))).toBe(true);
    expect(isTransferableAccount(createAccount({ type: "bank" }))).toBe(true);
    expect(isTransferableAccount(createAccount({ type: "wallet" }))).toBe(true);
    expect(isTransferableAccount(createAccount({ type: "savings" }))).toBe(
      true,
    );
  });

  it("rechaza cuentas no transferibles", () => {
    expect(isTransferableAccount(createAccount({ type: "credit_card" }))).toBe(
      false,
    );
    expect(isTransferableAccount(createAccount({ type: "investment" }))).toBe(
      false,
    );
  });
});

describe("getSourceAccounts", () => {
  it("filtra cuentas no transferibles y sin saldo", () => {
    const accounts = [
      source,
      createAccount({
        id: "empty" as Account["id"],
        balance: 0,
      }),
      createAccount({
        id: "card" as Account["id"],
        type: "credit_card",
        balance: 500,
      }),
      createAccount({
        id: "cash" as Account["id"],
        type: "cash",
        balance: 50,
      }),
    ];

    expect(getSourceAccounts(accounts).map((account) => account.id)).toEqual([
      source.id,
      "cash",
    ]);
  });
});

describe("getDestinationAccounts", () => {
  it("excluye el origen, cuentas no transferibles y otras monedas", () => {
    const accounts = [
      source,
      destination,
      createAccount({
        id: "usd" as Account["id"],
        currency: "USD",
      }),
      createAccount({
        id: "card" as Account["id"],
        type: "credit_card",
      }),
    ];

    expect(
      getDestinationAccounts(accounts, source).map((account) => account.id),
    ).toEqual([destination.id]);
  });

  it("devuelve una lista vacía cuando no hay origen", () => {
    expect(getDestinationAccounts([source, destination])).toEqual([]);
  });
});

describe("toAccountOption", () => {
  it("incluye el nombre y el saldo formateado", () => {
    expect(toAccountOption(source)).toEqual({
      value: source.id,
      label: "Banco · ARS 1.000,00",
    });
  });
});

describe("getInitialTransferValues", () => {
  it("selecciona la primera cuenta de origen y su primer destino válido", () => {
    expect(getInitialTransferValues([source, destination])).toEqual({
      fromAccountId: source.id,
      toAccountId: destination.id,
      amount: "",
      note: "",
    });
  });

  it("devuelve valores vacíos cuando no hay cuentas disponibles", () => {
    expect(getInitialTransferValues([])).toEqual({
      fromAccountId: "",
      toAccountId: "",
      amount: "",
      note: "",
    });
  });
});

describe("toCreateTransferPayload", () => {
  it("convierte el monto y recorta la nota", () => {
    expect(
      toCreateTransferPayload({
        fromAccountId: "source",
        toAccountId: "destination",
        amount: "250.50",
        note: "  Depósito  ",
      }),
    ).toEqual({
      fromAccountId: "source",
      toAccountId: "destination",
      amount: 250.5,
      note: "Depósito",
    });
  });

  it("omite la nota cuando está vacía", () => {
    expect(
      toCreateTransferPayload({
        fromAccountId: "source",
        toAccountId: "destination",
        amount: "10",
        note: "   ",
      }),
    ).toEqual({
      fromAccountId: "source",
      toAccountId: "destination",
      amount: 10,
      note: undefined,
    });
  });
});
