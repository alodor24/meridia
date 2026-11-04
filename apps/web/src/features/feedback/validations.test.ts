import { describe, expect, it } from "vitest";
import { feedbackValidationSchema } from "./validations";

const validValues = {
  type: "suggestion" as const,
  subject: "Mejorar los filtros",
  message: "Me gustaría poder guardar filtros de movimientos.",
};

describe("feedbackValidationSchema", () => {
  it("acepta un mensaje válido y recorta espacios", async () => {
    const result = await feedbackValidationSchema.validate({
      ...validValues,
      subject: "  Mejorar los filtros  ",
      message: "  Me gustaría poder guardar filtros de movimientos.  ",
    });

    expect(result).toMatchObject({
      type: "suggestion",
      subject: "Mejorar los filtros",
      message: "Me gustaría poder guardar filtros de movimientos.",
    });
  });

  it("rechaza un asunto demasiado corto", async () => {
    await expect(
      feedbackValidationSchema.validate({ ...validValues, subject: "Hola" }),
    ).rejects.toThrow("El asunto debe tener al menos 5 caracteres");
  });

  it("rechaza un mensaje demasiado corto", async () => {
    await expect(
      feedbackValidationSchema.validate({ ...validValues, message: "Corto" }),
    ).rejects.toThrow("El mensaje debe tener al menos 10 caracteres");
  });

  it("rechaza un tipo desconocido", async () => {
    await expect(
      feedbackValidationSchema.validate({ ...validValues, type: "otro" }),
    ).rejects.toThrow("Selecciona un tipo de mensaje");
  });
});
