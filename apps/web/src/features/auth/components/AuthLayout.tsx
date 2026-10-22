import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useUiStore } from "@/stores/uiStore";
import { PATHS } from "@/conts";
import LogoApp from "@/components/ui/LogoApp";
import { SHADOW } from "@/theme/globalStyles";

export const AuthLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => {
  const snackbar = useUiStore((s) => s.snackbar);
  const hideSnackbar = useUiStore((s) => s.hideSnackbar);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: 2,
        py: 5,
      }}>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}>
          <MuiLink
            component={RouterLink}
            to={PATHS.HOME}
            underline="none"
            color="inherit"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LogoApp />
          </MuiLink>

          <Typography variant="body2" color="text.secondary" align="center">
            {subtitle}
          </Typography>
        </Box>

        <Card sx={{ boxShadow: SHADOW }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {title}
            </Typography>
            {children}
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert
          onClose={hideSnackbar}
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%", color: "primary.contrastText" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
