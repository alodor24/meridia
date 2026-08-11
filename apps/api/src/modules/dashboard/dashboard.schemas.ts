import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (usa formato YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (usa formato YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  limit: z.coerce.number().int().min(1).max(50).default(8),
});
