import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email inválido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

export const registerValidationSchema = Yup.object({
  name: Yup.string().trim().min(1, 'El nombre es requerido').max(80, 'Demasiado largo').required('El nombre es requerido'),
  email: Yup.string().trim().email('Email inválido').required('El email es requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'Demasiado larga')
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  country: Yup.string().required('Selecciona tu país'),
});

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;
export type RegisterFormValues = Yup.InferType<typeof registerValidationSchema>;
