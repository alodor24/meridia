import { getRouteApi } from "@tanstack/react-router";
import GoalsPage from "./GoalsPage";

const goalsRoute = getRouteApi("/app/goals");

export const GoalsPageRoute = () => {
  const { tab } = goalsRoute.useSearch();

  return <GoalsPage key={tab ?? "activas"} initialTab={tab} />;
};
