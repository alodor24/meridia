import { describe, expect, it } from "vitest";
import {
  buildOccurrenceValidationSchema,
  buildReminderValidationSchema,
} from "./validations";

const validValues = {
  title: "Alquiler",
  date: "2026-10-23",
  repeat: true,
  unit: "month" as const,
  interval: "1",
  endDate: "",
};

describe("buildReminderValidationSchema", () => {
  it("acepta un recordatorio recurrente válido", async () => {
    const schema = buildReminderValidationSchema();
    await expect(schema.validate(validValues)).resolves.toMatchObject({
      title: "Alquiler",
    });
  });

  it("acepta un recordatorio único", async () => {
    const schema = buildReminderValidationSchema();
    await expect(
      schema.validate({ ...validValues, repeat: false }),
    ).resolves.toBeTruthy();
  });

  it("exige el título", async () => {
    const schema = buildReminderValidationSchema();
    await expect(
      schema.validate({ ...validValues, title: "   " }),
    ).rejects.toThrow("El título es requerido");
  });

  it("valida el intervalo cuando se repite", async () => {
    const schema = buildReminderValidationSchema();
    await expect(
      schema.validate({ ...validValues, interval: "0" }),
    ).rejects.toThrow("El intervalo debe ser mayor a cero");
  });

  it("rechaza una fecha de fin anterior al inicio", async () => {
    const schema = buildReminderValidationSchema();
    await expect(
      schema.validate({ ...validValues, endDate: "2026-10-22" }),
    ).rejects.toThrow(
      "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    );
  });

  it("permite una fecha de fin igual al inicio", async () => {
    const schema = buildReminderValidationSchema();
    await expect(
      schema.validate({ ...validValues, endDate: "2026-10-23" }),
    ).resolves.toBeTruthy();
  });
});

describe("buildOccurrenceValidationSchema", () => {
  it("exige título y fecha", async () => {
    const schema = buildOccurrenceValidationSchema();
    await expect(
      schema.validate({ title: "", date: "" }),
    ).rejects.toBeTruthy();
    await expect(
      schema.validate({ title: "Alquiler", date: "2026-10-25" }),
    ).resolves.toBeTruthy();
  });
});
