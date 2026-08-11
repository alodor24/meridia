import { z } from 'zod';
import { TRANSACTION_TYPES } from '@meridia/shared';

const hexColor = /^#([0-9a-fA-F]{6})$/;

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  type: z.enum(TRANSACTION_TYPES, { errorMap: () => ({ message: 'Tipo de categoría inválido' }) }),
  color: z
    .string()
    .trim()
    .regex(hexColor, 'Color inválido (usa formato #RRGGBB)')
    .optional(),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Al menos un campo debe ser enviado',
  });

export const categoryParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
