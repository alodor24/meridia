import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PATHS } from "@/conts";
import FormLogin from "../components/FormLogin";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Tus finanzas personales, simples y seguras.">
      <FormLogin />

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: "center", mt: 2 }}>
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
