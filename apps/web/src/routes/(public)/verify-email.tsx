import { createFileRoute } from "@tanstack/react-router";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";

export interface VerifyEmailSearch {
  token?: string;
  email?: string;
}

export const Route = createFileRoute("/(public)/verify-email")({
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: VerifyEmailPage,
});
