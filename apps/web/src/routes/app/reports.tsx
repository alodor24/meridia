import { createFileRoute } from "@tanstack/react-router";
import ReportsPage from "@/features/reports/pages/ReportsPage";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});
