import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/reports")({
  component: () => {
    return <h1>Página de Reportes</h1>;
  },
});
