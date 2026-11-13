import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { ReminderOccurrence } from "@meridia/shared";
import { useUpdateReminderOccurrence } from "../hooks/useUpdateReminderOccurrence";
import ReminderOccurrenceForm from "./ReminderOccurrenceForm";

export interface ReminderOccurrenceFormDialogProps {
  occurrence: ReminderOccurrence | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ReminderOccurrenceFormDialog = ({
  occurrence,
  onClose,
  onSaved,
}: ReminderOccurrenceFormDialogProps) => {
  const { isPending } = useUpdateReminderOccurrence();

  return (
    <Dialog
      open={Boolean(occurrence)}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>Editar esta fecha</DialogTitle>
      {occurrence && (
        <ReminderOccurrenceForm
          occurrence={occurrence}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  );
};
