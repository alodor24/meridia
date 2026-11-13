import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PATHS } from "@/consts";
import FormLogin from "../components/FormLogin";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const LoginPage = () => {
  useDocumentTitle("Iniciar Sesión");

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Tus finanzas personales, simples y seguras.">
      <FormLogin />

      <MuiLink
        component={RouterLink}
        to={PATHS.FORGOT_PASSWORD}
        variant="body2"
        underline="none"
        sx={{ display: "block", mt: 2, textAlign: "center" }}>
        ¿Olvidaste tu contraseña?
      </MuiLink>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta?
        </Typography>

        <MuiLink
          component={RouterLink}
          to={PATHS.REGISTER}
          variant="body2"
          underline="none">
          Registrate
        </MuiLink>
      </Stack>
    </AuthLayout>
  );
};

export default LoginPage;
