import { useState } from 'react';
import { Button, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link as RouterLink, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Formik, Form } from 'formik';
import { COUNTRIES } from '@meridia/shared';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { FormTextField } from '@/components/ui/FormTextField';
import { FormSelect } from '@/components/ui/FormSelect';
import { registerValidationSchema, type RegisterFormValues } from '@/features/auth/validations';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { toApiError } from '@/services/api/errors';

function RegisterPage() {
  const status = useAuthStore((s) => s.status);
  const registerUser = useAuthStore((s) => s.registerUser);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to="/app/dashboard" replace />;
  }

  const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: `${c.name} (${c.currency})` }));

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      const country = COUNTRIES.find((c) => c.code === values.country);
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        country: values.country,
        currency: country?.currency ?? 'USD',
      });
      await navigate({ to: '/app/dashboard' });
    } catch (error) {
      showSnackbar(toApiError(error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Elegí tu país para usar tu moneda local.">
      <Formik
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <FormTextField name="name" label="Nombre" autoComplete="name" autoFocus />
            <FormTextField name="email" label="Email" type="email" autoComplete="email" />
            <FormSelect name="country" label="País" options={countryOptions} />
            <FormTextField name="password" label="Contraseña" type="password" autoComplete="new-password" />
            <FormTextField name="confirmPassword" label="Confirmar contraseña" type="password" autoComplete="new-password" />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={submitting} sx={{ mt: 2 }}>
              {submitting ? 'Creando cuenta…' : 'Registrarme'}
            </Button>
          </Form>
        )}
      </Formik>
      <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tenés cuenta?
        </Typography>
        <MuiLink component={RouterLink} to="/login" variant="body2">
          Iniciá sesión
        </MuiLink>
      </Stack>
    </AuthLayout>
  );
}

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});
