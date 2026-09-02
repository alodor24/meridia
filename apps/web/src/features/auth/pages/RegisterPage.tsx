import { useState } from "react";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Navigate, useNavigate } from "@tanstack/react-router";
import { Formik, Form } from "formik";
import { COUNTRIES } from "@meridia/shared";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { registerValidationSchema, type RegisterFormValues } from "@/features/auth/validations";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { toApiError } from "@/services/api/errors";
import { getCurrencySymbol } from "@/utils/format";
import { PATHS } from "@/conts";
import { ReactCountryFlag } from "react-country-flag";

const RegisterPage = () => {
  const status = useAuthStore((s) => s.status);
  const registerUser = useAuthStore((s) => s.registerUser);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated") {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: (
      <>
        <ReactCountryFlag
          countryCode={c.code}
          svg
          style={{
            width: "1.2em",
            height: "1.2em",
            marginRight: "0.5em",
          }}
          title={c.code}
        />

        <span>
          {c.name} ({getCurrencySymbol(c.currency)})
        </span>
      </>
    ),
  }));

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
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
        currency: country?.currency ?? "USD",
      });
      await navigate({ to: PATHS.DASHBOARD });
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Elige tu país para usar tu moneda local.">
      <Formik initialValues={initialValues} validationSchema={registerValidationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <FormTextField name="name" label="Nombre" autoComplete="name" />
            <FormTextField name="email" label="Email" type="email" autoComplete="email" />
            <FormSelect name="country" label="País" options={countryOptions} />
            <FormTextField name="password" label="Contraseña" type="password" autoComplete="new-password" />
            <FormTextField name="confirmPassword" label="Confirmar contraseña" type="password" autoComplete="new-password" />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              loading={submitting}
              loadingPosition="start"
              sx={{ mt: 2 }}>
              Registrarme
            </Button>
          </Form>
        )}
      </Formik>

      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tienes cuenta?
        </Typography>

        <MuiLink component={RouterLink} to={PATHS.LOGIN} variant="body2">
          Inicia sesión
        </MuiLink>
      </Stack>
    </AuthLayout>
  );
};

export default RegisterPage;
