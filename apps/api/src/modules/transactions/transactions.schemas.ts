import { z } from "zod";
import { TRANSACTION_TYPES } from "@meridia/shared";

const uuidSchema = z.uuid("ID inválido");

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (usa formato YYYY-MM-DD)");

const emptyToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

export const createTransactionSchema = z.object({
  accountId: uuidSchema,
  categoryId: uuidSchema,
  type: z.enum(TRANSACTION_TYPES, { error: "Tipo inválido" }),
  amount: z
    .number({ error: "El monto es requerido y debe ser un número" })
    .positive("El monto debe ser mayor a cero")
    .max(9_999_999_999.99, "Monto demasiado grande"),
  date: dateString,
  note: z
    .string()
    .trim()
    .max(255, "La nota no puede superar los 255 caracteres")
    .optional(),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Al menos un campo debe ser enviado",
  });

export const transactionParamsSchema = z.object({
  id: uuidSchema,
});

export const listTransactionsQuerySchema = z.object({
  from: emptyToUndefined(dateString).optional(),
  to: emptyToUndefined(dateString).optional(),
  accountId: emptyToUndefined(uuidSchema).optional(),
  categoryId: emptyToUndefined(uuidSchema).optional(),
  type: emptyToUndefined(z.enum(TRANSACTION_TYPES)).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
