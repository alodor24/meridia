import { Category, Dashboard, Receipt, Wallet } from "@mui/icons-material";
import { TooltipItem } from "chart.js";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/app/dashboard",
  ACCOUNTS: "/app/accounts",
  TRANSACTIONS: "/app/transactions",
  CATEGORIES: "/app/categories",
  PROFILE: "/app/profile",
  ABOUT: "/app/about",
  ANALYTICS: "/app/analytics",
  REPORTS: "/app/reports",
};

export const AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
];

export const ENDPOINT_ROUTES = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  REFRESH: "/api/auth/refresh",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  DASHBOARD: "/api/dashboard",
  ACCOUNTS: "/api/accounts",
  TRANSACTIONS: "/api/transactions",
  CATEGORIES: "/api/categories",
};

export const NAV_LINKS = [
  { label: "Inicio", to: PATHS.HOME },
  { label: "Iniciar sesión", to: PATHS.LOGIN },
  { label: "Crear cuenta", to: PATHS.REGISTER },
];

export const NAV_ITEMS = [
  { label: "Dashboard", to: PATHS.DASHBOARD, icon: Dashboard },
  { label: "Cuentas", to: PATHS.ACCOUNTS, icon: Wallet },
  { label: "Movimientos", to: PATHS.TRANSACTIONS, icon: Receipt },
  { label: "Categorías", to: PATHS.CATEGORIES, icon: Category },
];

export const PRESET_COLORS = [
  "#2e7d32",
  "#43a047",
  "#66bb6a",
  "#81c784",
  "#d32f2f",
  "#f57c00",
  "#0288d1",
  "#7b1fa2",
  "#f06292",
  "#3949ab",
  "#00838f",
  "#757575",
  "#d81b60",
  "#e53935",
  "#8e24aa",
  "#6d4c41",
];

export const PAGE_SIZE = 20;

export const DONOUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,
  cutout: "65%",
  layout: {
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const LINE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,
  layout: {
    padding: {
      top: 0,
      right: 20,
      bottom: 10,
      left: 10,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        title: (tooltipItems: TooltipItem<"line">[]) => {
          const day = tooltipItems[0]?.label;
          return `Día ${day}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,

        callback: (value: unknown, index: number) => {
          const day = index + 1;
          if (day === 1 || day % 5 === 0) return day;

          return "";
        },
      },
    },
  },
};
