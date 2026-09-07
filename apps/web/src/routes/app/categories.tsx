import { createFileRoute } from "@tanstack/react-router";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";

export const Route = createFileRoute("/app/categories")({
  component: CategoriesPage,
});
