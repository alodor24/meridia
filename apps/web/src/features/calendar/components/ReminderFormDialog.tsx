import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { ReminderOccurrence } from "@meridia/shared";
import { useCreateReminder } from "../hooks/useCreateReminder";
import { useUpdateReminder } from "../hooks/useUpdateReminder";
import ReminderForm from "./ReminderForm";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import EventIcon from "@mui/icons-material/Event";

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
      <Stack direction="row" sx={{ alignItems: "center", px: 3, pt: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "secondary.main",
            color: "primary.contrastText",
          }}>
          <EventIcon />
        </Avatar>
        <DialogTitle>
          {occurrence ? "Editar recordatorio" : "Nuevo recordatorio"}
        </DialogTitle>
      </Stack>

      <ReminderForm
        occurrence={occurrence}
        defaultDate={defaultDate}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
