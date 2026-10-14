import { createFileRoute } from "@tanstack/react-router";
import PublicLayout from "@/components/layout/PublicLayout";
import HomePage from "@/features/home/HomePage";

export const Route = createFileRoute("/(public)/")({
  component: () => (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  ),
});
