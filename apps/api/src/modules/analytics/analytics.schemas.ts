import { z } from "zod";

export const analyticsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido")
    .max(2100, "Año inválido")
    .optional(),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
