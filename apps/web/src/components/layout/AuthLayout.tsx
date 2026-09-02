import { PATHS } from "@/conts";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to={PATHS.DASHBOARD} />;

  return <Outlet />;
};

export default AuthLayout;
