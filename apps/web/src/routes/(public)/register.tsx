import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { redirectIfAuthenticated } from "@/features/auth/guards";

export const Route = createFileRoute("/(public)/register")({
  beforeLoad: redirectIfAuthenticated,
  component: RegisterPage,
});
