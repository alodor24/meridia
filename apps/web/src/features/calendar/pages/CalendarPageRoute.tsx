import { getRouteApi } from "@tanstack/react-router";
import CalendarPage from "./CalendarPage";

const calendarRoute = getRouteApi("/app/calendar");

export const CalendarPageRoute = () => {
  const { date } = calendarRoute.useSearch();

  return <CalendarPage key={date ?? "calendar"} focusDate={date} />;
};
