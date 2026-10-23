import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "@tanstack/react-router";
import Reveal from "./Reveal";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rings = [
  { size: 300, duration: 28, opacity: 0.5, dashed: true },
  { size: 470, duration: 42, opacity: 0.32, dashed: false },
  { size: 660, duration: 60, opacity: 0.2, dashed: true },
];

const CtaSection = () => {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Reveal from="translate3d(0, 36px, 0)">
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: 4, md: 6 },
              px: { xs: 3, md: 8 },
              py: { xs: 7, md: 10 },
              textAlign: "center",
              color: "#fff",
              background:
                "linear-gradient(135deg, #0050de 0%, #083a91 46%, #061a35 100%)",
              boxShadow: "0 40px 100px rgba(0, 32, 96, 0.35)",
            }}>
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, #000 10%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, #000 10%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            {rings.map((ring) => (
              <Box
                key={ring.size}
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: ring.size,
                  height: ring.size,
                  mt: `${-ring.size / 2}px`,
                  ml: `${-ring.size / 2}px`,
                  borderRadius: "50%",
                  border: ring.dashed
                    ? `1px dashed rgba(255,255,255,${ring.opacity})`
                    : `1px solid rgba(198,255,94,${ring.opacity})`,
                  animation: `${spin} ${ring.duration}s linear infinite`,
                  pointerEvents: "none",
                }}
              />
            ))}

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: 720,
                mx: "auto",
              }}>
              <Typography
                sx={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "#c6ff5e",
                  mb: 1.5,
                }}>
                EMPIEZA HOY
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3.6rem" },
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                }}>
                Tu próximo mes puede empezar ordenado.
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  mx: "auto",
                  maxWidth: 560,
                  fontSize: { xs: 15.5, md: 17.5 },
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.74)",
                }}>
                Crea tu cuenta, añade tus cuentas y descubre lo fácil que es
                entender tu dinero cuando todo está en el mismo lugar.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: "center", justifyContent: "center", mt: 4 }}>
                <Button
                  component={Link}
                  to="/register"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    px: 3,
                    py: 1.35,
                    fontSize: 16,
                    fontWeight: 800,
                    textTransform: "none",
                    color: "#06101f",
                    bgcolor: "#fff",
                    "&:hover": { bgcolor: "#eaf2ff" },
                    "& .MuiButton-endIcon": {
                      transition: "transform 250ms ease",
                    },
                    "&:hover .MuiButton-endIcon": {
                      transform: "translateX(4px)",
                    },
                  }}>
                  Crear cuenta
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  size="large"
                  variant="outlined"
                  sx={{
                    px: 3,
                    py: 1.35,
                    fontSize: 16,
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.38)",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}>
                  Iniciar sesión
                </Button>
              </Stack>

              <Typography
                sx={{
                  mt: 2.5,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                }}>
                Sin tarjetas. Sin configuración complicada.
              </Typography>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
};

export default CtaSection;
