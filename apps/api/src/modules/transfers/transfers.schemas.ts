import { z } from "zod";

const uuidSchema = z.uuid("ID inválido");

export const createTransferSchema = z
  .object({
    fromAccountId: uuidSchema,
    toAccountId: uuidSchema,
    amount: z
      .number({ error: "El monto es requerido y debe ser un número" })
      .positive("El monto debe ser mayor a cero")
      .max(9_999_999_999.99, "Monto demasiado grande")
      .refine((value) => Math.round(value * 100) > 0, {
        message: "El monto debe ser mayor a cero",
      }),
    note: z
      .string()
      .trim()
      .max(255, "La nota no puede superar los 255 caracteres")
      .optional(),
  })
  .refine((value) => value.fromAccountId !== value.toAccountId, {
    message: "Las cuentas de origen y destino deben ser distintas",
    path: ["toAccountId"],
  });

export const listTransfersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const transferParamsSchema = z.object({
  id: uuidSchema,
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
export type ListTransfersQuery = z.infer<typeof listTransfersQuerySchema>;
