import { DeletingReminder } from "../types";

export const getDeleteConfirmationContent = (
  deleting: DeletingReminder | null,
) => {
  const deletingSeries = deleting?.scope === "series";
  const deleteTitle = deletingSeries
    ? "Eliminar toda la serie"
    : deleting?.occurrence.recurrence
      ? "Eliminar esta fecha"
      : "Eliminar recordatorio";
  const deleteDescription = deleting
    ? deleting.scope === "series"
      ? `Se eliminarán todas las fechas de la serie "${deleting.occurrence.seriesTitle}".`
      : deleting.occurrence.recurrence
        ? "Se eliminará solo esta fecha. El resto de la serie se mantiene."
        : `¿Eliminar "${deleting.occurrence.title}"?`
    : undefined;

  return {
    deleteTitle,
    deleteDescription,
  };
};
