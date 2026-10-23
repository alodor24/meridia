import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DashboardPreview from "./DashboardPreview";
import Reveal from "./Reveal";
import useParallax from "../hooks/useParallax";

const callouts = [
  {
    icon: AccountBalanceWalletRoundedIcon,
    title: "Balance consolidado",
    description:
      "Todas tus cuentas y monedas reunidas en una cifra que sí significa algo.",
  },
  {
    icon: CategoryRoundedIcon,
    title: "Categorías visuales",
    description:
      "Identifica tus gastos por color e ícono sin revisar línea por línea.",
  },
  {
    icon: ReceiptLongRoundedIcon,
    title: "Historial claro",
    description:
      "Cada movimiento queda ordenado y disponible para cuando lo necesites.",
  },
];

const ShowcaseSection = () => {
  const theme = useTheme();
  const previewRef = useParallax(0.1);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          width: { xs: 420, md: 820 },
          height: { xs: 420, md: 820 },
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.14,
          )} 0%, transparent 68%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <Stack
            spacing={1.4}
            sx={{
              alignItems: "center",
              textAlign: "center",
              mb: { xs: 5, md: 7 },
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
              LA APP
            </Typography>
            <Typography
              component="h2"
              sx={{
                maxWidth: 760,
                fontSize: { xs: "2.1rem", md: "3.2rem" },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}>
              Tu mes completo, en una sola mirada.
            </Typography>
            <Typography
              sx={{
                maxWidth: 620,
                color: "text.secondary",
                fontSize: { xs: 15.5, md: 17 },
                lineHeight: 1.65,
              }}>
              Un panel pensado para responder las preguntas que importan: cuánto
              tienes, en qué se va y qué puedes ajustar.
            </Typography>
          </Stack>
        </Reveal>

        <Reveal delay={120} from="translate3d(0, 40px, 0)">
          <Box
            ref={previewRef}
            sx={{
              transform: "translate3d(0, var(--parallax-y, 0px), 0)",
            }}>
            <DashboardPreview variant="showcase" />
          </Box>
        </Reveal>

        <Grid container spacing={2.5} sx={{ mt: { xs: 5, md: 7 } }}>
          {callouts.map((callout, index) => (
            <Grid key={callout.title} size={{ xs: 12, md: 4 }}>
              <Reveal delay={index * 90}>
                <Stack
                  direction="row"
                  spacing={1.6}
                  sx={{
                    p: 2.2,
                    height: "100%",
                    borderRadius: 3,
                    border: 1,
                    borderColor: "divider",
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    transition: "border-color 250ms ease, transform 250ms ease",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      transform: "translateY(-3px)",
                    },
                  }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                    }}>
                    <callout.icon sx={{ fontSize: 21 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.4 }}>
                      {callout.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        color: "text.secondary",
                      }}>
                      {callout.description}
                    </Typography>
                  </Box>
                </Stack>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ShowcaseSection;
