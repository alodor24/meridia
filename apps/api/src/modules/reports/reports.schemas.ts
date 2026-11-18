import { z } from "zod";
import { TRANSACTION_TYPES } from "@meridia/shared";

const uuidSchema = z.uuid("ID inválido");

const isValidIsoDate = (value: string): boolean => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (usa formato YYYY-MM-DD)")
  .refine(isValidIsoDate, "Fecha inválida");

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T): T =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  ) as unknown as T;

const baseReportQuerySchema = z.object({
  format: z.enum(["pdf", "csv"], { error: "Formato inválido" }),
  period: z.enum(["monthly", "annual", "custom"], {
    error: "Período inválido",
  }),
  year: emptyToUndefined(
    z.coerce
      .number()
      .int()
      .min(1900, "Año inválido")
      .max(2100, "Año inválido")
      .optional(),
  ),
  month: emptyToUndefined(
    z.coerce
      .number()
      .int()
      .min(1, "Mes inválido")
      .max(12, "Mes inválido")
      .optional(),
  ),
  from: emptyToUndefined(dateString.optional()),
  to: emptyToUndefined(dateString.optional()),
  accountId: emptyToUndefined(uuidSchema.optional()),
  categoryId: emptyToUndefined(uuidSchema.optional()),
  type: emptyToUndefined(
    z.enum(TRANSACTION_TYPES, { error: "Tipo inválido" }).optional(),
  ),
});

export const reportQuerySchema = baseReportQuerySchema.superRefine(
  (value, ctx) => {
    if (value.period === "monthly") {
      if (value.year === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["year"],
          message: "El año es requerido para un reporte mensual",
        });
      }
      if (value.month === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["month"],
          message: "El mes es requerido para un reporte mensual",
        });
      }
    }

    if (value.period === "annual" && value.year === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["year"],
        message: "El año es requerido para un reporte anual",
      });
    }

    if (value.period === "custom") {
      if (!value.from) {
        ctx.addIssue({
          code: "custom",
          path: ["from"],
          message: "La fecha desde es requerida",
        });
      }
      if (!value.to) {
        ctx.addIssue({
          code: "custom",
          path: ["to"],
          message: "La fecha hasta es requerida",
        });
      }
      if (value.from && value.to && value.from > value.to) {
        ctx.addIssue({
          code: "custom",
          path: ["to"],
          message: "La fecha hasta debe ser mayor o igual a la fecha desde",
        });
      }
    }
  },
);

export type ReportQuery = z.infer<typeof reportQuerySchema>;
