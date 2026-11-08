import PrivateLayout from "@/components/layout/PrivateLayout";
import { PATHS } from "@/conts";
import { getCurrentUserQueryOptions } from "@/features/auth/hooks/useCurrentUser";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import queryClient from "@/services/query/queryClient";
import { toApiError } from "@/services/api/errors";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    try {
      await queryClient.query(getCurrentUserQueryOptions());
    } catch (error) {
      if (toApiError(error).code === "EMAIL_NOT_VERIFIED") {
        throw redirect({
          to: PATHS.VERIFY_EMAIL,
        });
      }

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
