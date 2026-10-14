import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginPage from "@/features/auth/pages/LoginPage";
import { PATHS } from "@/conts";
import { getCurrentUserQueryOptions } from "@/features/auth/hooks/useCurrentUser";
import queryClient from "@/services/query/queryClient";

export const Route = createFileRoute("/(public)/login")({
  beforeLoad: async () => {
    let user;

    try {
      user = await queryClient.query(getCurrentUserQueryOptions());
    } catch {
      return;
    }

    if (user) {
      throw redirect({
        to: PATHS.DASHBOARD,
      });
    }
  },
  component: LoginPage,
});
