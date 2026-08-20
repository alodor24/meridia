export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TRANSACTIONS: "/app/transactions",
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