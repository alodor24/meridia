import { createFileRoute } from "@tanstack/react-router";
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";

export const Route = createFileRoute("/app/transactions")({
  component: TransactionsPage,
});
