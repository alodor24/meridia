import { useEffect } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { useAuthStore } from "@/stores/authStore";

const SessionBootstrap = () => {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    if (status === "idle") {
      void bootstrap();
    }
  }, [status, bootstrap]);

  return null;
};

export const Route = createRootRoute({
  component: () => (
    <AppProviders>
      <SessionBootstrap />
      <Outlet />
    </AppProviders>
  ),
  notFoundComponent: () => <h1>Configurar página de error acá</h1>,
});
