import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link, Navigate } from "@tanstack/react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/stores/authStore";

const FEATURES = [
  {
    title: "Cuentas",
    description: "Registrá tus cuentas en varias monedas y seguí su saldo desde un solo lugar.",
    icon: <AccountBalanceWalletIcon color="primary" />,
  },
  {
    title: "Movimientos",
    description: "Anotá ingresos y gastos de forma rápida, siempre asociados a una categoría.",
    icon: <ReceiptIcon color="primary" />,
  },
  {
    title: "Categorías",
    description: "Organizá tus gastos para entender a dónde va tu dinero cada mes.",
    icon: <CategoryIcon color="primary" />,
  },
  {
    title: "Dashboard",
    description: "Visualizá balances, ingresos y gastos del período con gráficos claros.",
    icon: <DashboardIcon color="primary" />,
  },
];

const HomePage = () => {
  useDocumentTitle("Inicio");
  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}>
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: "center" }}>
          <Stack spacing={2} sx={{ alignItems: "center" }}>
            <PaymentsIcon color="primary" sx={{ fontSize: 56 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
              Tus finanzas personales, simples y seguras.
            </Typography>
            <Typography variant="h6" component="p" color="text.secondary" sx={{ maxWidth: 640 }}>
              Meridia te ayuda a registrar tus cuentas y movimientos, categorizar tus gastos y visualizar tu balance en un
              dashboard claro y en tu moneda.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
              <Button component={Link} to="/login" size="large" variant="contained">
                Iniciar sesión
              </Button>
              <Button component={Link} to="/register" size="large" variant="outlined">
                Crear cuenta
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}>
          ¿Qué podés hacer con Meridia?
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
              <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                <CardContent>
                  <Stack spacing={1}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
