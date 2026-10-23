import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes, useTheme } from "@mui/material/styles";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "@tanstack/react-router";
import Reveal from "./Reveal";

const growBar = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const rotateRing = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const monospace = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const currencies = [
  { code: "ARS", symbol: "$", amount: "4.820.500", color: "#42a5f5" },
  { code: "USD", symbol: "US$", amount: "1.240,50", color: "#7ee0c3" },
  { code: "EUR", symbol: "€", amount: "980,00", color: "#c6ff5e" },
];

const categoryItems = [
  { icon: RestaurantRoundedIcon, color: "#ffb74d" },
  { icon: HomeRoundedIcon, color: "#90caf9" },
  { icon: DirectionsCarRoundedIcon, color: "#f48fb1" },
  { icon: FitnessCenterRoundedIcon, color: "#7ee0c3" },
  { icon: SchoolRoundedIcon, color: "#b39ddb" },
  { icon: PetsRoundedIcon, color: "#ffd54f" },
];

const bars = [38, 54, 44, 68, 58, 82, 64, 94];

const VisualShell = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 150,
        p: 2,
        borderRadius: 3,
        overflow: "hidden",
        border: 1,
        borderColor: alpha(theme.palette.primary.main, 0.14),
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
            : `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, rgba(255,255,255,0.02) 100%)`,
      }}>
      {children}
    </Box>
  );
};

const CurrencyVisual = () => (
  <VisualShell>
    <Stack direction="row" spacing={1}>
      {currencies.map((currency) => (
        <Box
          key={currency.code}
          sx={{
            flex: 1,
            minWidth: 0,
            p: 1.3,
            borderRadius: 2.5,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography
              sx={{
                fontFamily: monospace,
                fontSize: 10,
                fontWeight: 700,
                color: "text.secondary",
              }}>
              {currency.code}
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: alpha(currency.color, 0.18),
                color: currency.color,
                fontSize: 10,
                fontWeight: 900,
              }}>
              {currency.symbol}
            </Box>
          </Stack>
          <Typography
            noWrap
            sx={{
              mt: 1,
              fontWeight: 800,
              fontSize: { xs: 12, sm: 14 },
              letterSpacing: "-0.03em",
            }}>
            {currency.amount}
          </Typography>
        </Box>
      ))}
    </Stack>
    <Stack
      direction="row"
      sx={{ alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
        Total convertido
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
        USD 5.140,20
      </Typography>
    </Stack>
  </VisualShell>
);

const QuickEntryVisual = () => {
  const theme = useTheme();

  return (
    <VisualShell>
      <Box
        sx={{
          p: 1.6,
          borderRadius: 2.5,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          boxShadow: `0 14px 34px ${alpha(theme.palette.common.black, 0.1)}`,
        }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontFamily: monospace,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "text.secondary",
            }}>
            NUEVO MOVIMIENTO
          </Typography>
          <Chip
            label="Hoy"
            size="small"
            sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
          />
        </Stack>

        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.4,
          }}>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 21 },
                fontWeight: 900,
                letterSpacing: "-0.035em",
              }}>
              - ARS 18.450,00
            </Typography>
            <Stack
              direction="row"
              spacing={0.6}
              sx={{ alignItems: "center", mt: 0.4 }}>
              <ShoppingBagRoundedIcon
                sx={{ fontSize: 14, color: "warning.main" }}
              />
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                Supermercado
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "success.main",
              color: "#fff",
              boxShadow: `0 8px 20px ${alpha(theme.palette.success.main, 0.35)}`,
            }}>
            <CheckRoundedIcon sx={{ fontSize: 19 }} />
          </Box>
        </Stack>
      </Box>
      <Typography
        sx={{
          mt: 1.2,
          textAlign: "center",
          fontSize: 10.5,
          color: "text.secondary",
        }}>
        Listo en segundos, sin salir del panel.
      </Typography>
    </VisualShell>
  );
};

const CategoriesVisual = () => (
  <VisualShell>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1.2,
      }}>
      {categoryItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            placeItems: "center",
            py: 1,
            borderRadius: 2,
            bgcolor: alpha(item.color, 0.12),
            border: 1,
            borderColor: alpha(item.color, 0.22),
          }}>
          <item.icon sx={{ fontSize: 24, color: item.color }} />
        </Box>
      ))}
    </Box>
  </VisualShell>
);

const DashboardVisual = () => {
  const theme = useTheme();

  return (
    <VisualShell>
      <Stack
        direction="row"
        sx={{ alignItems: "flex-end", gap: 0.8, height: 110, pt: 1 }}>
        {bars.map((height, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: `${height}%`,
              borderRadius: "6px 6px 2px 2px",
              transformOrigin: "bottom",
              background:
                index === bars.length - 1
                  ? "linear-gradient(180deg, #c6ff5e 0%, #2ec4a0 100%)"
                  : `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.85)} 0%, ${alpha(theme.palette.secondary.main, 0.4)} 100%)`,
              animation: `${growBar} 650ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 70}ms both`,
            }}
          />
        ))}
      </Stack>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
        <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
          Últimos 8 meses
        </Typography>
        <Typography
          sx={{ fontSize: 11, fontWeight: 800, color: "success.main" }}>
          +18,6%
        </Typography>
      </Stack>
    </VisualShell>
  );
};

const PrivacyVisual = () => {
  const theme = useTheme();

  return (
    <VisualShell>
      <Box
        sx={{
          position: "relative",
          display: "grid",
          placeItems: "center",
          minHeight: 112,
        }}>
        {[92, 68].map((size, index) => (
          <Box
            key={size}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.28)}`,
              animation: `${rotateRing} ${18 + index * 8}s linear infinite`,
            }}
          />
        ))}
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            border: 1,
            borderColor: alpha(theme.palette.primary.main, 0.24),
            color: "primary.main",
          }}>
          <LockRoundedIcon sx={{ fontSize: 25 }} />
        </Box>
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 10.5,
          fontWeight: 700,
          color: "text.secondary",
          mt: 0.5,
        }}>
        Acceso privado con tu cuenta
      </Typography>
    </VisualShell>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
  size: { xs?: number; sm?: number; md?: number };
  delay?: number;
}

const FeatureCard = ({
  title,
  description,
  icon,
  visual,
  size,
  delay = 0,
}: FeatureCardProps) => {
  const theme = useTheme();

  return (
    <Grid size={size}>
      <Reveal delay={delay} sx={{ height: "100%" }}>
        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            transition:
              "transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
            "&:hover": {
              transform: "translateY(-5px)",
              borderColor: alpha(theme.palette.primary.main, 0.42),
              boxShadow: `0 24px 60px ${alpha(theme.palette.common.black, 0.12)}`,
            },
          }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
            <Stack spacing={1.3}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}>
                {icon}
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: 18, md: 20 },
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                }}>
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "text.secondary",
                  pb: 1,
                }}>
                {description}
              </Typography>
            </Stack>
            <Box sx={{ mt: 1 }}>{visual}</Box>
          </CardContent>
        </Card>
      </Reveal>
    </Grid>
  );
};

const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          right: "-10%",
          top: "20%",
          width: { xs: 280, md: 460 },
          height: { xs: 280, md: 460 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            0.12,
          )} 0%, transparent 68%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", px: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", md: "flex-end" },
            justifyContent: "space-between",
            mb: { xs: 5, md: 7 },
          }}>
          <Box sx={{ maxWidth: 680 }}>
            <Typography
              sx={{
                fontFamily: monospace,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "primary.main",
                mb: 1.2,
              }}>
              FUNCIONES
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2.1rem", md: "3.2rem" },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}>
              Menos planillas. Más claridad.
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 560,
                color: "text.secondary",
                fontSize: { xs: 15.5, md: 17 },
                lineHeight: 1.65,
              }}>
              Cada herramienta está pensada para que registrar y entender tu
              dinero tome menos tiempo del que imaginas.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/register"
            variant="outlined"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              flexShrink: 0,
              px: 2.4,
              py: 1.1,
              fontWeight: 700,
              textTransform: "none",
              "& .MuiButton-endIcon": { transition: "transform 250ms ease" },
              "&:hover .MuiButton-endIcon": { transform: "translateX(4px)" },
            }}>
            Empezar ahora
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          <FeatureCard
            title="Todas tus monedas, un solo lugar"
            description="Registra cuentas en distintas monedas y consulta el total consolidado sin hacer cuentas aparte."
            icon={<AccountBalanceWalletRoundedIcon />}
            visual={<CurrencyVisual />}
            size={{ xs: 12, md: 7 }}
          />
          <FeatureCard
            title="Movimientos en segundos"
            description="Ingresa un gasto o ingreso con monto, categoría y fecha. Nada más."
            icon={<BoltRoundedIcon />}
            visual={<QuickEntryVisual />}
            size={{ xs: 12, md: 5 }}
            delay={90}
          />
          <FeatureCard
            title="Categorías que se entienden"
            description="Colores e íconos para reconocer cada gasto de un vistazo."
            icon={<CategoryRoundedIcon />}
            visual={<CategoriesVisual />}
            size={{ xs: 12, sm: 6, md: 4 }}
          />
          <FeatureCard
            title="Un dashboard que cuenta historias"
            description="Tendencias, comparativas y el pulso de tu mes sin fórmulas."
            icon={<InsightsRoundedIcon />}
            visual={<DashboardVisual />}
            size={{ xs: 12, sm: 6, md: 4 }}
            delay={90}
          />
          <FeatureCard
            title="Tu información, bajo tu control"
            description="Cada cuenta accede solo a sus propios datos, con sesión protegida."
            icon={<LockRoundedIcon />}
            visual={<PrivacyVisual />}
            size={{ xs: 12, md: 4 }}
            delay={180}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default FeaturesSection;
