import { isValid, parseISO } from "date-fns";

export const parseFocusDate = (focusDate?: string): Date | undefined => {
  if (!focusDate) return undefined;

  const parsed = parseISO(focusDate);
  return isValid(parsed) ? parsed : undefined;
};
