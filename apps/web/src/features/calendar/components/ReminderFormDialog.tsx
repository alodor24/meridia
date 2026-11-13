import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { ReminderOccurrence } from "@meridia/shared";
import { useCreateReminder } from "../hooks/useCreateReminder";
import { useUpdateReminder } from "../hooks/useUpdateReminder";
import ReminderForm from "./ReminderForm";

export interface ReminderFormDialogProps {
  open: boolean;
  occurrence: ReminderOccurrence | null;
  defaultDate: string;
  onClose: () => void;
  onSaved: () => void;
}

export const ReminderFormDialog = ({
  open,
  occurrence,
  defaultDate,
  onClose,
  onSaved,
}: ReminderFormDialogProps) => {
  const { isPending: isCreating } = useCreateReminder();
  const { isPending: isUpdating } = useUpdateReminder();
  const isPending = isCreating || isUpdating;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>
        {occurrence ? "Editar recordatorio" : "Nuevo recordatorio"}
      </DialogTitle>
      <ReminderForm
        occurrence={occurrence}
        defaultDate={defaultDate}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
