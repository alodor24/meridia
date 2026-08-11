import { z } from 'zod';
import { COUNTRIES } from '@meridia/shared';

const countryCodes = COUNTRIES.map((c) => c.code);

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  email: z
    .string({ required_error: 'El email es requerido' })
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(254, 'Email demasiado largo'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede superar los 128 caracteres'),
  country: z
    .string({ required_error: 'El país es requerido' })
    .trim()
    .toUpperCase()
    .length(2, 'Código de país inválido')
    .refine((value) => countryCodes.includes(value), 'País no soportado'),
  currency: z
    .string({ required_error: 'La moneda es requerida' })
    .trim()
    .toUpperCase()
    .length(3, 'Código de moneda inválido')
    .regex(/^[A-Z]{3}$/, 'Código de moneda inválido'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const updateProfileSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
