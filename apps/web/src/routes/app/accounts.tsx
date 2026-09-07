import { createFileRoute } from "@tanstack/react-router";
import AccountsPage from "@/features/accounts/pages/AccountsPage";

export const Route = createFileRoute("/app/accounts")({
  component: AccountsPage,
});
