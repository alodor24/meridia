import { Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link as RouterLink, Navigate } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PATHS } from "@/conts";
import FormRegister from "../components/FormRegister";
import { useAuthStore } from "@/stores/authStore";

const RegisterPage = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Gestiona tus finanzas usando tu moneda local.">
      <FormRegister />

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: "center", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tienes cuenta?
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

export default RegisterPage;
