import { Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink, Navigate } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuthStore } from "@/stores/authStore";
import { PATHS } from "@/conts";
import FormLogin from "../components/FormLogin";

const LoginPage = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

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
