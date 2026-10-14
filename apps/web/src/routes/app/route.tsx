import PrivateLayout from "@/components/layout/PrivateLayout";
import { PATHS } from "@/conts";
import { getCurrentUserQueryOptions } from "@/features/auth/hooks/useCurrentUser";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import queryClient from "@/services/query/queryClient";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    try {
      await queryClient.query(getCurrentUserQueryOptions());
    } catch {
      throw redirect({
        to: PATHS.LOGIN,
      });
    }
  },
  component: () => (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  ),
});
