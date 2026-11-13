import { describe, expect, it } from "vitest";
import {
  forgotPasswordValidationSchema,
  registerValidationSchema,
  resetPasswordValidationSchema,
} from "./validations";

const validValues = {
  name: "Ana",
  email: "ana@test.com",
  password: "Meridia2026!Segura",
  confirmPassword: "Meridia2026!Segura",
  country: "AR",
};

describe("registerValidationSchema", () => {
  it("acepta una contraseña fuerte y confirmación correcta", async () => {
    await expect(registerValidationSchema.isValid(validValues)).resolves.toBe(
      true,
    );
  });

  it("rechaza contraseñas que no cumplen la política", async () => {
    const invalidPasswords = [
      "Corta1!",
      "Meridia2026",
      "meridia2026!segura",
      "MERIDIA2026!SEGURA",
      "Meridia!Segura",
      "Meridia2026Segura",
      "Meridia1!    ",
    ];

    for (const password of invalidPasswords) {
      const valid = await registerValidationSchema.isValid({
        ...validValues,
        password,
        confirmPassword: password,
      });
      expect(valid, password).toBe(false);
    }
  });

  it("rechaza una confirmación distinta", async () => {
    const valid = await registerValidationSchema.isValid({
      ...validValues,
      confirmPassword: "Meridia2026!Otra",
    });
    expect(valid).toBe(false);
  });
});

describe("forgotPasswordValidationSchema", () => {
  it("acepta un email válido", async () => {
    await expect(
      forgotPasswordValidationSchema.isValid({ email: "ana@test.com" }),
    ).resolves.toBe(true);
  });

  it("rechaza un email inválido", async () => {
    await expect(
      forgotPasswordValidationSchema.isValid({ email: "no-es-email" }),
    ).resolves.toBe(false);
  });
});

describe("resetPasswordValidationSchema", () => {
  it("acepta una contraseña fuerte y confirmación correcta", async () => {
    await expect(
      resetPasswordValidationSchema.isValid({
        password: "Meridia2026!Segura",
        confirmPassword: "Meridia2026!Segura",
      }),
    ).resolves.toBe(true);
  });

  it("rechaza contraseñas débiles", async () => {
    const invalidPasswords = [
      "Corta1!",
      "Meridia2026",
      "meridia2026!segura",
      "MERIDIA2026!SEGURA",
      "Meridia!Segura",
      "Meridia2026Segura",
      "Meridia1!    ",
    ];

    for (const password of invalidPasswords) {
      await expect(
        resetPasswordValidationSchema.isValid({
          password,
          confirmPassword: password,
        }),
        password,
      ).resolves.toBe(false);
    }
  });

  it("rechaza una confirmación distinta", async () => {
    await expect(
      resetPasswordValidationSchema.isValid({
        password: "Meridia2026!Segura",
        confirmPassword: "Meridia2026!Otra",
      }),
    ).resolves.toBe(false);
  });
});
