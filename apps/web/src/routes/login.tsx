import { useState } from 'react';
import Button from '@mui/material/Button';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Formik, Form } from 'formik';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { FormTextField } from '@/components/ui/FormTextField';
import { loginValidationSchema, type LoginFormValues } from '@/features/auth/validations';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { toApiError } from '@/services/api/errors';

function LoginPage() {
  const status = useAuthStore((s) => s.status);
  const loginUser = useAuthStore((s) => s.loginUser);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to="/app/dashboard" replace />;
  }

  const initialValues: LoginFormValues = { email: '', password: '' };

  const handleSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      await loginUser({ email: values.email, password: values.password });
      await navigate({ to: '/app/dashboard' });
    } catch (error) {
      showSnackbar(toApiError(error).message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Tus finanzas personales, simples y seguras.">
      <Formik initialValues={initialValues} validationSchema={loginValidationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <FormTextField name="email" label="Email" type="email" autoComplete="email" autoFocus />
            <FormTextField name="password" label="Contraseña" type="password" autoComplete="current-password" />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={submitting} sx={{ mt: 2 }}>
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </Form>
        )}
      </Formik>
      <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tenés cuenta?
        </Typography>
        <MuiLink component={RouterLink} to="/register" variant="body2">
          Registrate
        </MuiLink>
      </Stack>
    </AuthLayout>
  );
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
