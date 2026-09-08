import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/about")({
  component: () => {
    return <h1>Página de Acerca de</h1>;
  },
});
