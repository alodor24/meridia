import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiLink from "@mui/material/Link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  getRouteApi,
  Link as RouterLink,
  useNavigate,
} from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { FormTextField } from "@/components/ui/FormTextField";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PATHS } from "@/consts";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useResetPassword } from "../hooks/useResetPassword";
import useShowPassword from "../hooks/useShowPassword";
import {
  resetPasswordValidationSchema,
  type ResetPasswordFormValues,
} from "../validations";

const resetPasswordRoute = getRouteApi("/(public)/reset-password");

type ResetResult = {
  token: string;
  status: "success" | "invalid";
};

const ResetPasswordPage = () => {
  const { token } = resetPasswordRoute.useSearch();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { showPassword, handleClickShowPassword } = useShowPassword();
  const [result, setResult] = useState<ResetResult | null>(null);

  const status = !token
    ? "invalid"
    : result?.token === token
      ? result.status
      : "idle";

  useDocumentTitle(
    status === "success"
      ? "Contraseña actualizada"
      : status === "invalid"
        ? "Enlace inválido"
        : "Restablecer contraseña",
  );

  const initialValues: ResetPasswordFormValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      await resetPassword.mutateAsync({
        token,
        password: values.password,
      });
      setResult({ token, status: "success" });
    } catch (error) {
      const apiError = toApiError(error);

      if (apiError.code === "INVALID_PASSWORD_RESET_TOKEN") {
        setResult({ token, status: "invalid" });
        return;
      }

      showSnackbar(apiError.message, "error");
    }
  };

  if (status === "success") {
    return (
      <AuthLayout
        title="Contraseña actualizada"
        subtitle="Ya podés usar tu nueva contraseña para ingresar.">
        <Alert severity="success" sx={{ mb: 2 }}>
          Tu contraseña fue actualizada correctamente.
        </Alert>

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            background: (theme) =>
              `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
          }}
          onClick={() => void navigate({ to: PATHS.LOGIN })}>
          Iniciar sesión
        </Button>
      </AuthLayout>
    );
  }

  if (!token || status === "invalid") {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="El enlace para restablecer tu contraseña ya no es válido.">
        <Alert severity="error" sx={{ mb: 2 }}>
          Solicitá un nuevo enlace para continuar con el cambio de contraseña.
        </Alert>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => void navigate({ to: PATHS.FORGOT_PASSWORD })}>
          Solicitar nuevo enlace
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => void navigate({ to: PATHS.LOGIN })}>
          Volver a iniciar sesión
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Creá una contraseña nueva y segura para tu cuenta.">
      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <FormTextField
              name="password"
              label="Nueva contraseña"
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
            <PasswordStrengthMeter password={formik.values.password} />
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
              loading={resetPassword.isPending}
              loadingPosition="start"
              sx={{
                mt: 2,
                background: (theme) =>
                  `linear-gradient(45deg,${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
              }}>
              Guardar contraseña
            </Button>
          </Form>
        )}
      </Formik>

      <MuiLink
        component={RouterLink}
        to={PATHS.LOGIN}
        variant="body2"
        underline="none"
        sx={{ display: "block", mt: 2, textAlign: "center" }}>
        Volver a iniciar sesión
      </MuiLink>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
