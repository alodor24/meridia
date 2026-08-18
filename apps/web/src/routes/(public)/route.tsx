import { PublicLayout } from "@/components/layout/PublicLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});
