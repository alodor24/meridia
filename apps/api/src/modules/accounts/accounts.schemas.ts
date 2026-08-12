import { z } from 'zod';
import { ACCOUNT_TYPES } from '@meridia/shared';

export const createAccountSchema = z.object({
  name: z
    .string({ error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  type: z.enum(ACCOUNT_TYPES, { error: 'Tipo de cuenta inválido' }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3, 'Código de moneda inválido')
    .regex(/^[A-Z]{3}$/, 'Código de moneda inválido')
    .optional(),
});

export const updateAccountSchema = createAccountSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Al menos un campo debe ser enviado',
  });

export const accountParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
