import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";

export const Route = createFileRoute("/(public)/forgot-password")({
  component: ForgotPasswordPage,
});
