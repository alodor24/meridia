import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes, useTheme } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link } from "@tanstack/react-router";
import DashboardPreview from "./DashboardPreview";
import useParallax from "../hooks/useParallax";

const fadeUp = keyframes`
  from { opacity: 0; transform: translate3d(0, 26px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

const drift = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(18px, -24px, 0) scale(1.06); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.8); }
`;

const highlights = [
  "Multi-moneda",
  "Categorías a tu medida",
  "Un solo dashboard",
];

const HeroSection = () => {
  const theme = useTheme();
  const orbRef = useParallax(0.22);
  const previewRef = useParallax(-0.07);

  const isLight = theme.palette.mode === "light";
  const gradient = `linear-gradient(92deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 52%, #2ec4a0 100%)`;
  const gridLine = isLight
    ? "rgba(0, 80, 222, 0.09)"
    : "rgba(144, 202, 249, 0.08)";

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderBottom: 1,
        borderColor: "divider",
        background: isLight
          ? "linear-gradient(180deg, #f8fbff 0%, #eef4ff 55%, #eceff1 100%)"
          : "linear-gradient(180deg, #050607 0%, #07101f 55%, #050607 100%)",
      }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 72% 62% at 50% 36%, #000 18%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 62% at 50% 36%, #000 18%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <Box
        ref={orbRef}
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "-18%",
          left: "-10%",
          width: { xs: 320, md: 560 },
          height: { xs: 320, md: 560 },
          transform: "translate3d(0, var(--parallax-y, 0px), 0)",
          pointerEvents: "none",
        }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.main,
              isLight ? 0.28 : 0.4,
            )} 0%, transparent 68%)`,
            filter: "blur(60px)",
            animation: `${drift} 15s ease-in-out infinite`,
          }}
        />
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          right: "-12%",
          bottom: "-24%",
          width: { xs: 340, md: 620 },
          height: { xs: 340, md: 620 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            isLight ? 0.22 : 0.28,
          )} 0%, transparent 66%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 7, md: 11 },
          pb: { xs: 9, md: 13 },
        }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.02fr 0.98fr" },
            alignItems: "center",
            gap: { xs: 7, md: 9, lg: 6 },
          }}>
          <Stack spacing={{ xs: 2.6, md: 3 }} sx={{ maxWidth: 680 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                width: "fit-content",
                px: 1.6,
                py: 0.7,
                borderRadius: 10,
                border: 1,
                borderColor: alpha(theme.palette.primary.main, 0.28),
                bgcolor: alpha(theme.palette.background.paper, 0.66),
                backdropFilter: "blur(10px)",
                animation: `${fadeUp} 700ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both`,
              }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#2ec4a0",
                  boxShadow: "0 0 12px #2ec4a0",
                  animation: `${blink} 2.2s ease-in-out infinite`,
                }}
              />
              <Typography
                sx={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: { xs: 10, sm: 11 },
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                }}>
                FINANZAS PERSONALES · SIN COMPLICACIONES
              </Typography>
            </Box>

            <Box
              sx={{
                animation: `${fadeUp} 800ms cubic-bezier(0.22, 1, 0.36, 1) 170ms both`,
              }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.9rem", sm: "4rem", lg: "4.9rem" },
                  lineHeight: 0.98,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: "text.primary",
                }}>
                Tus finanzas,
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}>
                  por fin claras.
                </Box>
              </Typography>
            </Box>

            <Typography
              sx={{
                maxWidth: 560,
                fontSize: { xs: 16.5, md: 18.5 },
                lineHeight: 1.65,
                color: "text.secondary",
                animation: `${fadeUp} 800ms cubic-bezier(0.22, 1, 0.36, 1) 260ms both`,
              }}>
              Meridia reúne tus cuentas, movimientos y categorías en un
              dashboard que te muestra exactamente dónde estás y hacia dónde
              vas. Sin hojas de cálculo, sin ruido.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                animation: `${fadeUp} 800ms cubic-bezier(0.22, 1, 0.36, 1) 350ms both`,
              }}>
              <Button
                component={Link}
                to="/register"
                size="large"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  px: 3,
                  py: 1.35,
                  fontSize: 16,
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: `0 16px 34px ${alpha(theme.palette.primary.main, 0.32)}`,
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
                  borderColor: alpha(theme.palette.text.primary, 0.22),
                  color: "text.primary",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.55),
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                  },
                }}>
                Ya tengo cuenta
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2.5 }}
              sx={{
                flexWrap: "wrap",
                rowGap: 1,
                animation: `${fadeUp} 800ms cubic-bezier(0.22, 1, 0.36, 1) 440ms both`,
              }}>
              {highlights.map((item) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={0.7}
                  sx={{ alignItems: "center" }}>
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 16, color: "success.main" }}
                  />
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Box
            ref={previewRef}
            sx={{
              transform: "translate3d(0, var(--parallax-y, 0px), 0)",
            }}>
            <Box
              sx={{
                animation: `${fadeUp} 1000ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both`,
              }}>
              <DashboardPreview />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
