import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "@tanstack/react-router";
import PrivateLayout from "@/components/layout/PrivateLayout";

const AppLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Navigate to="/login" />;

  return <PrivateLayout />;
};

export const Route = createFileRoute("/app")({
  component: AppLayout,
});
