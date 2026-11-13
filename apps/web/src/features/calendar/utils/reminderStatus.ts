import type { ReminderOccurrence } from "@meridia/shared";
import { today } from "@/utils/format";

export const isReminderOverdue = (
  occurrence: Pick<ReminderOccurrence, "status" | "date">,
  todayKey = today(),
): boolean => occurrence.status === "pending" && occurrence.date < todayKey;
