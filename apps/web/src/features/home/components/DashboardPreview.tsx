import { useId } from "react";
import type { PointerEvent } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, keyframes, useTheme } from "@mui/material/styles";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import CoffeeIcon from "@mui/icons-material/Coffee";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PaymentsIcon from "@mui/icons-material/Payments";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

interface DashboardPreviewProps {
  variant?: "hero" | "showcase";
}

const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -12px, 0); }
`;

const drawLine = keyframes`
  from { stroke-dashoffset: 720; }
  to { stroke-dashoffset: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
`;

const transactions = [
  {
    name: "Supermercado",
    category: "Alimentación",
    amount: "- ARS 18.450,00",
    icon: LocalGroceryStoreIcon,
    color: "#ffb74d",
  },
  {
    name: "Sueldo",
    category: "Ingresos",
    amount: "+ ARS 950.000,00",
    icon: PaymentsIcon,
    color: "#7ee0c3",
  },
  {
    name: "Café",
    category: "Ocio",
    amount: "- ARS 3.200,00",
    icon: CoffeeIcon,
    color: "#f48fb1",
  },
  {
    name: "Suscripciones",
    category: "Servicios",
    amount: "- ARS 8.900,00",
    icon: SubscriptionsIcon,
    color: "#90caf9",
  },
];

const DashboardPreview = ({ variant = "hero" }: DashboardPreviewProps) => {
  const theme = useTheme();
  const rawId = useId();
  const chartId = rawId.replace(/:/g, "");
  const isShowcase = variant === "showcase";
  const visibleTransactions = isShowcase
    ? transactions
    : transactions.slice(0, 3);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${(-y * 3).toFixed(2)}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${(x * 4).toFixed(2)}deg`,
    );
  };

  const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: isShowcase ? 880 : 560,
        mx: "auto",
        perspective: "1400px",
      }}>
      <Box
        sx={{
          animation: isShowcase ? `${float} 9s ease-in-out infinite` : "none",
        }}>
        <Box
          sx={{
            transform:
              "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
            transformStyle: "preserve-3d",
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: 3, md: isShowcase ? 4 : 3.5 },
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background:
                "linear-gradient(155deg, #0c1729 0%, #0a1220 48%, #070d17 100%)",
              color: "#eef4ff",
              boxShadow:
                "0 40px 100px rgba(0, 24, 80, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
              p: { xs: 2, sm: isShowcase ? 3.5 : 3 },
            }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `radial-gradient(circle at 82% 0%, ${alpha(
                  theme.palette.primary.main,
                  0.28,
                )} 0%, transparent 38%), radial-gradient(circle at 0% 100%, ${alpha(
                  theme.palette.secondary.main,
                  0.16,
                )} 0%, transparent 34%)`,
              }}
            />

            <Box sx={{ position: "relative" }}>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2.5,
                }}>
                <Stack
                  direction="row"
                  spacing={1.2}
                  sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, #0050de 0%, #42a5f5 100%)",
                      boxShadow: "0 8px 20px rgba(0, 80, 222, 0.4)",
                      fontWeight: 900,
                      fontSize: 18,
                    }}>
                    M
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>
                      Meridia
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: "rgba(238,244,255,0.5)" }}>
                      Panel financiero
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label="Actualizado ahora"
                  size="small"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    bgcolor: "rgba(126, 224, 195, 0.1)",
                    color: "#7ee0c3",
                    border: "1px solid rgba(126, 224, 195, 0.2)",
                    fontSize: 10,
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 1.2 },
                    "&::before": {
                      content: '""',
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#7ee0c3",
                      ml: 0.4,
                      animation: `${pulse} 2.4s ease-in-out infinite`,
                    },
                  }}
                />
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1.5,
                }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(238,244,255,0.5)",
                      fontWeight: 700,
                    }}>
                    Balance total
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 0.5,
                      mt: 0.5,
                    }}>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        fontSize: { xs: 25, sm: isShowcase ? 36 : 30 },
                        lineHeight: 1,
                      }}>
                      ARS 4.820.500
                    </Typography>
                    <Typography
                      component="sup"
                      sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(238,244,255,0.55)",
                      }}>
                      ,00
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  icon={
                    <ArrowUpwardRoundedIcon
                      sx={{ fontSize: "14px !important" }}
                    />
                  }
                  label="12,4%"
                  size="small"
                  sx={{
                    bgcolor: "rgba(126, 224, 195, 0.12)",
                    color: "#7ee0c3",
                    border: "1px solid rgba(126, 224, 195, 0.2)",
                    fontWeight: 800,
                    fontSize: 11,
                    mt: 0.5,
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "relative",
                  mt: 1,
                  mb: 2,
                  borderRadius: 2.5,
                  overflow: "hidden",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
                }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    top: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    zIndex: 1,
                  }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#c6ff5e",
                      boxShadow: "0 0 12px #c6ff5e",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "rgba(238,244,255,0.55)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                    }}>
                    ÚLTIMOS 30 DÍAS
                  </Typography>
                </Box>

                <Box
                  component="svg"
                  viewBox="0 0 340 110"
                  role="presentation"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: { xs: 104, sm: isShowcase ? 180 : 132 },
                  }}>
                  <defs>
                    <linearGradient
                      id={`${chartId}-area`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="0%"
                        stopColor="#42a5f5"
                        stopOpacity="0.42"
                      />
                      <stop offset="100%" stopColor="#42a5f5" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id={`${chartId}-line`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0">
                      <stop offset="0%" stopColor="#42a5f5" />
                      <stop offset="60%" stopColor="#7ee0c3" />
                      <stop offset="100%" stopColor="#c6ff5e" />
                    </linearGradient>
                  </defs>

                  {[30, 60, 90].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="340"
                      y1={y}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 6"
                    />
                  ))}

                  <path
                    d="M0 88 C22 80 38 86 58 66 C78 46 92 46 112 54 C132 62 148 72 168 48 C188 24 204 20 224 32 C244 44 262 56 282 34 C302 12 316 18 340 12 L340 110 L0 110 Z"
                    fill={`url(#${chartId}-area)`}
                  />
                  <path
                    d="M0 88 C22 80 38 86 58 66 C78 46 92 46 112 54 C132 62 148 72 168 48 C188 24 204 20 224 32 C244 44 262 56 282 34 C302 12 316 18 340 12"
                    fill="none"
                    stroke={`url(#${chartId}-line)`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="720"
                    style={{
                      animation: `${drawLine} 1.8s cubic-bezier(0.22, 1, 0.36, 1) 400ms both`,
                    }}
                  />
                  <circle
                    cx="340"
                    cy="12"
                    r="4"
                    fill="#c6ff5e"
                    stroke="#0a1220"
                    strokeWidth="2"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.25,
                  mb: 2,
                }}>
                {[
                  {
                    label: "Ingresos",
                    value: "ARS 1.240.000",
                    icon: TrendingUpRoundedIcon,
                    color: "#7ee0c3",
                  },
                  {
                    label: "Gastos",
                    value: "ARS 845.300",
                    icon: TrendingDownRoundedIcon,
                    color: "#f48fb1",
                  },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 1.25,
                      bgcolor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      sx={{ alignItems: "center", mb: 0.4 }}>
                      <stat.icon sx={{ fontSize: 15, color: stat.color }} />
                      <Typography
                        sx={{
                          fontSize: 10,
                          color: "rgba(238,244,255,0.5)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}>
                        {stat.label}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: { xs: 13, sm: 14 },
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}>
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 0.5 }}
              />

              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                  Últimos movimientos
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: "#90caf9", fontWeight: 700 }}>
                  Ver todos
                </Typography>
              </Stack>

              <Box>
                {visibleTransactions.map((transaction, index) => (
                  <Box key={transaction.name}>
                    {index > 0 && (
                      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    )}
                    <Stack
                      direction="row"
                      spacing={1.2}
                      sx={{ alignItems: "center", py: 1 }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          bgcolor: alpha(transaction.color, 0.14),
                          color: transaction.color,
                        }}>
                        <transaction.icon sx={{ fontSize: 17 }} />
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{ fontSize: 13, fontWeight: 700 }}>
                          {transaction.name}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 10.5,
                            color: "rgba(238,244,255,0.45)",
                          }}>
                          {transaction.category}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                          color: transaction.amount.startsWith("+")
                            ? "#7ee0c3"
                            : "rgba(238,244,255,0.85)",
                        }}>
                        {transaction.amount}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: { xs: -14, sm: -34, md: -52 },
          right: { xs: -6, sm: -24, md: -40 },
          display: { xs: "none", sm: "block" },
          animation: `${float} 6.5s ease-in-out infinite`,
          zIndex: 2,
        }}>
        <Box
          sx={{
            minWidth: 158,
            borderRadius: 3,
            px: 2,
            py: 1.5,
            bgcolor: "rgba(13, 24, 42, 0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 60px rgba(0, 15, 50, 0.45)",
            backdropFilter: "blur(12px)",
            color: "#eef4ff",
          }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(238,244,255,0.5)",
            }}>
            Ahorro del mes
          </Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 18, mt: 0.3 }}>
            + ARS 120.000
          </Typography>
          <Box
            sx={{
              height: 5,
              mt: 1,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}>
            <Box
              sx={{
                width: "68%",
                height: "100%",
                borderRadius: 5,
                background: "linear-gradient(90deg, #42a5f5, #7ee0c3)",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: -18, sm: -26 },
          left: { xs: -4, sm: -20, md: -36 },
          display: { xs: "none", sm: "block" },
          animation: `${float} 7.5s ease-in-out infinite 300ms`,
          zIndex: 2,
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.1,
            borderRadius: 3,
            px: 1.8,
            py: 1.2,
            bgcolor: "rgba(13, 24, 42, 0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 60px rgba(0, 15, 50, 0.45)",
            backdropFilter: "blur(12px)",
            color: "#eef4ff",
          }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(244, 143, 177, 0.14)",
              color: "#f48fb1",
            }}>
            <SubscriptionsIcon sx={{ fontSize: 17 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
              3 suscripciones
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: "rgba(238,244,255,0.5)" }}>
              - ARS 8.900,00 al mes
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPreview;
