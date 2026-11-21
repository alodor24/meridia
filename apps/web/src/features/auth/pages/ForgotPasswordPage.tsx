import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PATHS } from "@/consts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import FormForgotPassword from "../components/FormForgotPassword";

const ForgotPasswordPage = () => {
  useDocumentTitle("Recuperar contraseña");

  return (
    <AuthLayout
      title="Restablecer acceso"
      subtitle="Te enviaremos un enlace para que puedas crear una nueva.">
      <FormForgotPassword />

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: "center", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya la recordaste?
        </Typography>

        <MuiLink
          component={RouterLink}
          to={PATHS.LOGIN}
          variant="body2"
          underline="none">
          Inicia sesión
        </MuiLink>
      </Stack>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
