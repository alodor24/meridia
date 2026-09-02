import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import SessionBootstrap from "@/components/SessionBootstrap";
import ErrorPage from "@/ErrorPage";

export const Route = createRootRoute({
  component: () => (
    <AppProviders>
      <SessionBootstrap />
      <Outlet />
    </AppProviders>
  ),
  notFoundComponent: ErrorPage,
});
