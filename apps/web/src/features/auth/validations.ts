import * as Yup from 'yup';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './utils/passwordStrength';

const strongPasswordSchema = () =>
  Yup.string()
    .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    .max(PASSWORD_MAX_LENGTH, `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres`)
    .test(
      'non-space-length',
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
      (value) => !value || value.replace(/\s/g, '').length >= PASSWORD_MIN_LENGTH,
    )
    .matches(/[a-z]/, 'La contraseña debe incluir al menos una minúscula')
    .matches(/[A-Z]/, 'La contraseña debe incluir al menos una mayúscula')
    .matches(/[0-9]/, 'La contraseña debe incluir al menos un número')
    .matches(/[^A-Za-z0-9\s]/, 'La contraseña debe incluir al menos un símbolo');

export const loginValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email inválido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

export const registerValidationSchema = Yup.object({
  name: Yup.string().trim().min(1, 'El nombre es requerido').max(80, 'Demasiado largo').required('El nombre es requerido'),
  email: Yup.string().trim().email('Email inválido').required('El email es requerido'),
  password: strongPasswordSchema().required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  country: Yup.string().required('Selecciona tu país'),
});

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email inválido').required('El email es requerido'),
});

export const resetPasswordValidationSchema = Yup.object({
  password: strongPasswordSchema().required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;
export type RegisterFormValues = Yup.InferType<typeof registerValidationSchema>;
export type ForgotPasswordFormValues = Yup.InferType<typeof forgotPasswordValidationSchema>;
export type ResetPasswordFormValues = Yup.InferType<typeof resetPasswordValidationSchema>;
