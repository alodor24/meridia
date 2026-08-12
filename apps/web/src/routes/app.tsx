import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

const AppLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Navigate to="/login" />;

  return <AppShell />;
};

export const Route = createFileRoute("/app")({
  component: AppLayout,
});
