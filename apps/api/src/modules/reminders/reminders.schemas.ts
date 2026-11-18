import { z } from 'zod';
import {
  REMINDER_OCCURRENCE_STATUSES,
  REMINDER_RECURRENCE_UNITS,
} from '@meridia/shared';
import { isoDateRangeInDays } from './reminders.recurrence';

const uuidSchema = z.uuid('ID inválido');

const dateString = z.iso.date({
  error: 'Fecha inválida (usa formato YYYY-MM-DD)',
});

const titleSchema = z
  .string()
  .trim()
  .min(1, 'El título es requerido')
  .max(120, 'El título no puede superar los 120 caracteres');

const recurrenceSchema = z.object({
  unit: z.enum(REMINDER_RECURRENCE_UNITS, {
    error: 'Unidad de recurrencia inválida',
  }),
  interval: z
    .number({ error: 'El intervalo es requerido y debe ser un número' })
    .int('El intervalo debe ser un número entero')
    .min(1, 'El intervalo debe ser mayor a cero')
    .max(999, 'El intervalo es demasiado grande'),
  endDate: dateString.nullish(),
});

export const createReminderSchema = z
  .object({
    title: titleSchema,
    date: dateString,
    recurrence: recurrenceSchema.nullish(),
  })
  .superRefine((value, ctx) => {
    const endDate = value.recurrence?.endDate;
    if (endDate && endDate < value.date) {
      ctx.addIssue({
        code: 'custom',
        path: ['recurrence', 'endDate'],
        message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
      });
    }
  });

export const updateReminderSchema = z
  .object({
    title: titleSchema.optional(),
    date: dateString.optional(),
    recurrence: recurrenceSchema.nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Al menos un campo debe ser enviado',
  });

export const reminderParamsSchema = z.object({
  id: uuidSchema,
});

export const reminderOccurrenceParamsSchema = z.object({
  id: uuidSchema,
  occurrenceDate: dateString,
});

export const updateReminderOccurrenceSchema = z
  .object({
    title: titleSchema.optional(),
    date: dateString.optional(),
    status: z.enum(REMINDER_OCCURRENCE_STATUSES, {
      error: 'Estado inválido',
    }).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Al menos un campo debe ser enviado',
  });

export const listRemindersQuerySchema = z
  .object({
    from: dateString,
    to: dateString,
  })
  .refine((value) => value.to >= value.from, {
    path: ['to'],
    message: 'La fecha "hasta" debe ser posterior o igual a "desde"',
  })
  .refine((value) => isoDateRangeInDays(value.from, value.to) <= 366, {
    path: ['to'],
    message: 'El rango de fechas no puede superar los 366 días',
  });

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type UpdateReminderOccurrenceInput = z.infer<
  typeof updateReminderOccurrenceSchema
>;
export type ListRemindersQuery = z.infer<typeof listRemindersQuerySchema>;
