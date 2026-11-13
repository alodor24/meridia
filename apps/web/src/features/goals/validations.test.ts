import { describe, expect, it } from "vitest";
import {
  buildContributionValidationSchema,
  buildReleaseValidationSchema,
} from "./validations";

describe("buildContributionValidationSchema", () => {
  const schema = buildContributionValidationSchema({
    sourceLimits: { internal: 100, external: 50 },
    remainingAmount: 200,
  });

  it("acepta un monto dentro del saldo disponible y de lo que falta", async () => {
    await expect(
      schema.validate({ sourceAccountId: "internal", amount: 100 }),
    ).resolves.toBeDefined();
  });

  it("rechaza un monto mayor al saldo disponible de la cuenta", async () => {
    await expect(
      schema.validate({ sourceAccountId: "external", amount: 50.01 }),
    ).rejects.toThrow("Saldo insuficiente en la cuenta de origen");
  });

  it("rechaza un monto mayor a lo que falta para la meta", async () => {
    const remainingSchema = buildContributionValidationSchema({
      sourceLimits: { internal: 300 },
      remainingAmount: 200,
    });

    await expect(
      remainingSchema.validate({ sourceAccountId: "internal", amount: 200.01 }),
    ).rejects.toThrow("El monto supera lo que falta para completar la meta");
  });

  it("requiere una cuenta de origen", async () => {
    await expect(
      schema.validate({ sourceAccountId: "", amount: 10 }),
    ).rejects.toThrow("Selecciona una cuenta de origen");
  });
});

describe("buildReleaseValidationSchema", () => {
  const schema = buildReleaseValidationSchema(100);

  it("acepta liberar hasta el monto reservado", async () => {
    await expect(schema.validate({ amount: 100 })).resolves.toBeDefined();
  });

  it("rechaza liberar más de lo reservado", async () => {
    await expect(schema.validate({ amount: 100.01 })).rejects.toThrow(
      "No puedes liberar más de lo reservado",
    );
  });

  it("rechaza montos no positivos", async () => {
    await expect(schema.validate({ amount: 0 })).rejects.toThrow(
      "El monto debe ser mayor a cero",
    );
  });
});
