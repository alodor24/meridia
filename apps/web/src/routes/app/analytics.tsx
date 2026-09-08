import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/analytics")({
  component: () => {
    return <h1>Página de Analytics</h1>;
  },
});
