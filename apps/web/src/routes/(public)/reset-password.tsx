import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

export interface ResetPasswordSearch {
  token?: string;
}

export const Route = createFileRoute("/(public)/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPasswordPage,
});
