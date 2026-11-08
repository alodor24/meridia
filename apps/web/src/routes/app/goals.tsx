import { createFileRoute } from "@tanstack/react-router";
import { GoalsPageRoute } from "@/features/goals/pages/GoalsPageRoute";
import type { GoalsTab } from "@/features/goals/types";

const validateSearch = (
  search: Record<string, unknown>,
): { tab?: GoalsTab } => ({
  tab: search.tab === "finalizadas" ? "finalizadas" : undefined,
});

export const Route = createFileRoute("/app/goals")({
  validateSearch,
  component: GoalsPageRoute,
});
