import { createFileRoute } from "@tanstack/react-router";
import FeedbackPage from "@/features/feedback/pages/FeedbackPage";

export const Route = createFileRoute("/app/feedback")({
  component: FeedbackPage,
});
