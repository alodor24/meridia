import { createFileRoute } from "@tanstack/react-router";
import { isValid, parseISO } from "date-fns";
import { CalendarPageRoute } from "@/features/calendar/pages/CalendarPageRoute";

const validateSearch = (
  search: Record<string, unknown>,
): { date?: string } => ({
  date:
    typeof search.date === "string" && isValid(parseISO(search.date))
      ? search.date
      : undefined,
});

export const Route = createFileRoute("/app/calendar")({
  validateSearch,
  component: CalendarPageRoute,
});
