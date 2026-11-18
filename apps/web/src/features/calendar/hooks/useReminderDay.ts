import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { ReminderOccurrence } from "@meridia/shared";
import { toApiError } from "@/services/api/errors";
import { useUiStore } from "@/stores/uiStore";
import { useUpdateReminderOccurrence } from "./useUpdateReminderOccurrence";

const useReminderDay = ({
  occurrences,
}: {
  occurrences: ReminderOccurrence[];
}) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync: updateOccurrence, isPending } =
    useUpdateReminderOccurrence();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOccurrence, setMenuOccurrence] =
    useState<ReminderOccurrence | null>(null);

  const sortedOccurrences = useMemo(
    () =>
      [...occurrences].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "pending" ? -1 : 1;
        }
        return a.title.localeCompare(b.title, "es");
      }),
    [occurrences],
  );

  const handleTogglePaid = async (occurrence: ReminderOccurrence) => {
    try {
      await updateOccurrence({
        reminderId: occurrence.reminderId,
        occurrenceDate: occurrence.occurrenceDate,
        payload: {
          status: occurrence.status === "paid" ? "pending" : "paid",
        },
      });
      showSnackbar(
        occurrence.status === "paid"
          ? "Recordatorio marcado como pendiente"
          : "Pago registrado",
      );
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  const openMenu = (
    event: MouseEvent<HTMLElement>,
    occurrence: ReminderOccurrence,
  ) => {
    setMenuAnchor(event.currentTarget);
    setMenuOccurrence(occurrence);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuOccurrence(null);
  };

  const runMenuAction = (action: (occurrence: ReminderOccurrence) => void) => {
    if (menuOccurrence) action(menuOccurrence);
    closeMenu();
  };

  return {
    isPending,
    menuAnchor,
    sortedOccurrences,
    handleTogglePaid,
    openMenu,
    closeMenu,
    runMenuAction,
    menuOccurrence,
  };
};

export default useReminderDay;
