import { describe, expect, it } from "vitest";
import type { Account } from "@meridia/shared";
import { buildTransferValidationSchema } from "./validations";

const now = new Date().toISOString();

const accounts: Account[] = [
  {
    id: "source" as Account["id"],
    userId: "user" as Account["userId"],
    name: "Banco",
    type: "bank",
    currency: "ARS",
    balance: 1000,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "destination" as Account["id"],
    userId: "user" as Account["userId"],
    name: "Billetera",
    type: "wallet",
    currency: "ARS",
    balance: 0,
    createdAt: now,
    updatedAt: now,
  },
];

const schema = buildTransferValidationSchema(accounts);

const values = {
  fromAccountId: "source",
  toAccountId: "destination",
  amount: "250",
  note: "",
};

describe("buildTransferValidationSchema", () => {
  it("acepta una transferencia válida", async () => {
    await expect(schema.validate(values)).resolves.toBeTruthy();
  });

  it("rechaza transferir más que el saldo disponible", async () => {
    await expect(
      schema.validate({ ...values, amount: "1000.01" }),
    ).rejects.toThrow("Saldo insuficiente en la cuenta de origen");
  });

  it("rechaza usar la misma cuenta como origen y destino", async () => {
    await expect(
      schema.validate({ ...values, toAccountId: "source" }),
    ).rejects.toThrow("Las cuentas deben ser distintas");
  });
});
