import type { Paginated, Reminder, ReminderOccurrence } from "@meridia/shared";
import { ENDPOINT_ROUTES } from "@/consts";
import { http } from "@/services/api/client";
import type {
  CreateReminderPayload,
  ReminderFilters,
  UpdateReminderOccurrencePayload,
  UpdateReminderPayload,
} from "../types";

const occurrencePath = (reminderId: string, occurrenceDate: string) =>
  `${ENDPOINT_ROUTES.REMINDERS}/${reminderId}/occurrences/${occurrenceDate}`;

export const reminderApi = {
  listReminders: (filters: ReminderFilters) =>
    http.get<Paginated<ReminderOccurrence>>(ENDPOINT_ROUTES.REMINDERS, {
      params: filters,
    }),

  createReminder: async (payload: CreateReminderPayload) => {
    const result = await http.post<{ reminder: Reminder }>(
      ENDPOINT_ROUTES.REMINDERS,
      payload,
    );
    return result.reminder;
  },

  updateReminder: async (id: string, payload: UpdateReminderPayload) => {
    const result = await http.patch<{ reminder: Reminder }>(
      `${ENDPOINT_ROUTES.REMINDERS}/${id}`,
      payload,
    );
    return result.reminder;
  },

  updateReminderOccurrence: async (
    reminderId: string,
    occurrenceDate: string,
    payload: UpdateReminderOccurrencePayload,
  ) => {
    const result = await http.patch<{ occurrence: ReminderOccurrence }>(
      occurrencePath(reminderId, occurrenceDate),
      payload,
    );
    return result.occurrence;
  },

  deleteReminder: (id: string) =>
    http.delete<null>(`${ENDPOINT_ROUTES.REMINDERS}/${id}`),

  deleteReminderOccurrence: (reminderId: string, occurrenceDate: string) =>
    http.delete<null>(occurrencePath(reminderId, occurrenceDate)),
};
