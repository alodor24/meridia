import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/app/dashboard" />;

  return <Outlet />;
};

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});
