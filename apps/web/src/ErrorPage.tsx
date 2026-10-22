import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "@tanstack/react-router";
import { PATHS } from "./conts";
import ErrorImage from "@/assets/images/errorImage.webp";

const ErrorPage = () => {
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
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            gap: 1,
          }}>
          <img src={ErrorImage} width={300} alt="Error" />
          <Typography component="h1" variant="h3" align="center" sx={{ fontWeight: 700 }} color="primary">
            Oops! Página no encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            La página que estás buscando no existe o ha sido movida.
          </Typography>
          <Button component={Link} to={PATHS.HOME} variant="outlined" color="secondary">
            Volver a la página principal
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
