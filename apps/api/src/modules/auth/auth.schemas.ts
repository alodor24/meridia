import { z } from 'zod';
import { COUNTRIES } from '@meridia/shared';

const countryCodes = COUNTRIES.map((c) => c.code);

export const registerSchema = z.object({
  name: z
    .string({ error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  email: z
    .string({ error: 'El email es requerido' })
    .trim()
    .toLowerCase()
    .email('Email inválido')
    .max(254, 'Email demasiado largo'),
  password: z
    .string({ error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede superar los 128 caracteres'),
  country: z
    .string({ error: 'El país es requerido' })
    .trim()
    .toUpperCase()
    .length(2, 'Código de país inválido')
    .refine((value) => countryCodes.includes(value), 'País no soportado'),
  currency: z
    .string({ error: 'La moneda es requerida' })
    .trim()
    .toUpperCase()
    .length(3, 'Código de moneda inválido')
    .regex(/^[A-Z]{3}$/, 'Código de moneda inválido'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const isCloudinaryAvatarUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'res.cloudinary.com' &&
      url.pathname.includes('/image/upload/')
    );
  } catch {
    return false;
  }
};

export const updateProfileSchema = z
  .object({
    name: z
      .string({ error: 'El nombre es requerido' })
      .trim()
      .min(1, 'El nombre es requerido')
      .max(80, 'El nombre no puede superar los 80 caracteres')
      .optional(),
    avatar: z
      .string()
      .trim()
      .max(2048, 'La URL del avatar es demasiado larga')
      .url('URL de avatar inválida')
      .refine(isCloudinaryAvatarUrl, 'La URL del avatar debe ser de Cloudinary')
      .optional(),
    avatarPublicId: z
      .string()
      .trim()
      .max(300, 'El public_id del avatar es demasiado largo')
      .regex(
        /^meridia\/avatars\/[a-zA-Z0-9_-]{1,64}\/[a-zA-Z0-9_-]{1,64}$/,
        'public_id de avatar inválido',
      )
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.avatar !== undefined, {
    message: 'Debes enviar al menos un campo para actualizar',
  })
  .refine(
    (data) =>
      (data.avatar === undefined) === (data.avatarPublicId === undefined),
    {
      message: 'El avatar y su public_id deben enviarse juntos',
      path: ['avatarPublicId'],
    },
  )
  .refine(
    (data) =>
      !data.avatar ||
      !data.avatarPublicId ||
      data.avatar.includes(data.avatarPublicId),
    {
      message: 'El public_id no coincide con la URL del avatar',
      path: ['avatarPublicId'],
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
