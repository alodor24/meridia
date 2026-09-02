import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "@tanstack/react-router";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { PATHS } from "@/conts";

const AppLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Navigate to={PATHS.LOGIN} />;

  return <PrivateLayout />;
};

export default AppLayout;
