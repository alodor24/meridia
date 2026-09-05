import { useState } from "react";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { Formik, Form } from "formik";
import { COUNTRIES } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  registerValidationSchema,
  type RegisterFormValues,
} from "@/features/auth/validations";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { toApiError } from "@/services/api/errors";
import { getCurrencySymbol } from "@/utils/format";
import { PATHS } from "@/conts";
import { ReactCountryFlag } from "react-country-flag";
import useShowPassword from "../hooks/useShowPassword";

const FormRegister = () => {
  const registerUser = useAuthStore((s) => s.registerUser);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { showPassword, handleClickShowPassword } = useShowPassword();

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
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleSubmit}>
      {() => (
        <Form>
          <FormTextField name="name" label="Nombre" autoComplete="name" />
          <FormTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <FormSelect name="country" label="País" options={countryOptions} />
          <FormTextField
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormTextField
            name="confirmPassword"
            label="Confirmar contraseña"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={submitting}
            loadingPosition="start"
            sx={{
              mt: 2,
              background: (theme) =>
                `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
            }}>
            Registrarme
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormRegister;
