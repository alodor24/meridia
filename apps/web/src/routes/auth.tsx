import AuthLayout from "@/components/layout/AuthLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});
