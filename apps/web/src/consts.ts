import Assessment from "@mui/icons-material/Assessment";
import BarChart from "@mui/icons-material/BarChart";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Category from "@mui/icons-material/Category";
import Dashboard from "@mui/icons-material/Dashboard";
import FeedbackOutlined from "@mui/icons-material/FeedbackOutlined";
import Info from "@mui/icons-material/Info";
import Person from "@mui/icons-material/Person";
import Receipt from "@mui/icons-material/Receipt";
import Wallet from "@mui/icons-material/Wallet";
import { TooltipItem } from "chart.js";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/app/dashboard",
  ACCOUNTS: "/app/accounts",
  TRANSACTIONS: "/app/transactions",
  CALENDAR: "/app/calendar",
  CATEGORIES: "/app/categories",
  PROFILE: "/app/profile",
  ABOUT: "/app/about",
  ANALYTICS: "/app/analytics",
  REPORTS: "/app/reports",
  FEEDBACK: "/app/feedback",
};

export const AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

export const ENDPOINT_ROUTES = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_VERIFICATION: "/api/auth/resend-verification",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  REFRESH: "/api/auth/refresh",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  DASHBOARD: "/api/dashboard",
  ANALYTICS: "/api/analytics",
  REPORTS: "/api/reports/transactions",
  FEEDBACK: "/api/feedback",
  ACCOUNTS: "/api/accounts",
  TRANSACTIONS: "/api/transactions",
  REMINDERS: "/api/reminders",
  TRANSFERS: "/api/transfers",
  NOTIFICATIONS: "/api/notifications",
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
  { label: "Analítica", to: PATHS.ANALYTICS, icon: BarChart },
  { label: "Calendario", to: PATHS.CALENDAR, icon: CalendarMonth },
  { label: "Reportes", to: PATHS.REPORTS, icon: Assessment },
];

export const USER_MENU_ITEMS = [
  { label: "Mi perfil", to: PATHS.PROFILE, icon: Person },
  { label: "Sugerencias", to: PATHS.FEEDBACK, icon: FeedbackOutlined },
  { label: "Acerca de", to: PATHS.ABOUT, icon: Info },
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

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

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
