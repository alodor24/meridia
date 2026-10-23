import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description:
      "Regístrate en menos de un minuto y elige la moneda con la que quieres ver tus finanzas.",
    icon: PersonAddAltRoundedIcon,
  },
  {
    number: "02",
    title: "Añade tus cuentas",
    description:
      "Suma tus cuentas y crea las categorías que mejor representen tu día a día.",
    icon: AccountBalanceWalletRoundedIcon,
  },
  {
    number: "03",
    title: "Mira el panorama",
    description:
      "Registra tus movimientos y deja que el dashboard te muestre el resto.",
    icon: InsightsRoundedIcon,
  },
];

const StepsSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: "-8%",
          bottom: "-20%",
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 420 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.14,
          )} 0%, transparent 68%)`,
          filter: "blur(45px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <Stack
            spacing={1.2}
            sx={{
              alignItems: "center",
              textAlign: "center",
              mb: { xs: 6, md: 8 },
            }}>
            <Typography
              sx={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "primary.main",
              }}>
              CÓMO FUNCIONA
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2.1rem", md: "3.2rem" },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}>
              Empieza en tres pasos.
            </Typography>
            <Typography
              sx={{
                maxWidth: 540,
                color: "text.secondary",
                fontSize: { xs: 15.5, md: 17 },
                lineHeight: 1.65,
              }}>
              Sin configuraciones eternas ni conceptos contables. Primero lo
              simple, después el detalle.
            </Typography>
          </Stack>
        </Reveal>

        <Box sx={{ position: "relative" }}>
          <Box
            aria-hidden="true"
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 28,
              left: "16.66%",
              right: "16.66%",
            }}>
            <Reveal
              from="scaleX(0)"
              delay={200}
              sx={{ transformOrigin: "left" }}>
              <Box
                sx={{
                  height: 2,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${alpha(
                    theme.palette.primary.main,
                    0.15,
                  )} 0%, ${alpha(theme.palette.primary.main, 0.65)} 50%, ${alpha(
                    theme.palette.secondary.main,
                    0.15,
                  )} 100%)`,
                }}
              />
            </Reveal>
          </Box>

          <Grid container spacing={{ xs: 4, md: 3 }}>
            {steps.map((step, index) => (
              <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                <Reveal delay={index * 120} sx={{ height: "100%" }}>
                  <Stack
                    spacing={1.3}
                    sx={{
                      alignItems: "center",
                      textAlign: "center",
                      px: { xs: 1, md: 2 },
                      height: "100%",
                    }}>
                    <Box
                      sx={{
                        position: "relative",
                        width: 58,
                        height: 58,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "background.paper",
                        border: 2,
                        borderColor: alpha(theme.palette.primary.main, 0.32),
                        color: "primary.main",
                        boxShadow: `0 12px 30px ${alpha(
                          theme.palette.primary.main,
                          0.16,
                        )}`,
                        zIndex: 1,
                      }}>
                      <step.icon sx={{ fontSize: 26 }} />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "text.secondary",
                      }}>
                      {step.number}
                    </Typography>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: { xs: 19, md: 20 },
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                      }}>
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        maxWidth: 340,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "text.secondary",
                      }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default StepsSection;
