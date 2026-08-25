import {Category, Dashboard, Receipt, Wallet} from "@mui/icons-material";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/app/dashboard",
  ACCOUNTS: "/app/accounts",
  TRANSACTIONS: "/app/transactions",
  CATEGORIES: "/app/categories",
  PROFILE: "/app/profile",
};

export const AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
];

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