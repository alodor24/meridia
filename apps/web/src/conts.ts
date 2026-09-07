import {Category, Dashboard, Receipt, Wallet, Analytics, Article} from "@mui/icons-material";

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
  { label: "Gráficos", to: PATHS.ANALYTICS, icon: Analytics },
  { label: "Reportes", to: PATHS.REPORTS, icon: Article },
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