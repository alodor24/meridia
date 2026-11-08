import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/features/auth/pages/LoginPage";
import { redirectIfAuthenticated } from "@/features/auth/guards";

export const Route = createFileRoute("/(public)/login")({
  beforeLoad: redirectIfAuthenticated,
  component: LoginPage,
});
