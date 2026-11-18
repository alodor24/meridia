import { z } from 'zod';

export const listNotificationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  unreadOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

export const notificationParamsSchema = z.object({
  id: z.uuid('ID inválido'),
});

export type ListNotificationsQuery = z.infer<
  typeof listNotificationsQuerySchema
>;
