import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import ErrorPage from "@/ErrorPage";

export const Route = createRootRoute({
  component: () => (
    <AppProviders>
      <Outlet />
    </AppProviders>
  ),
  notFoundComponent: ErrorPage,
});
