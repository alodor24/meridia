import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { ReminderOccurrence } from "@meridia/shared";
import { useUpdateReminderOccurrence } from "../hooks/useUpdateReminderOccurrence";
import ReminderOccurrenceForm from "./ReminderOccurrenceForm";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import EventIcon from "@mui/icons-material/Event";

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
        <DialogTitle>Editar esta fecha</DialogTitle>
      </Stack>

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
