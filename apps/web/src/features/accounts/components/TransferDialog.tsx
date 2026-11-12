import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account } from "@meridia/shared";
import { useTransferForm } from "../hooks/useTransferForm";
import { TransferForm } from "./TransferForm";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export interface TransferDialogProps {
  open: boolean;
  accounts: Account[];
  onClose: () => void;
  onSaved: () => void;
}

export const TransferDialog = ({
  open,
  accounts,
  onClose,
  onSaved,
}: TransferDialogProps) => {
  const { initialValues, validationSchema, handleSubmit, isPending } =
    useTransferForm({ accounts, onSaved });

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
          <SwapHorizIcon />
        </Avatar>
        <DialogTitle>Transferir saldo</DialogTitle>
      </Stack>

      <TransferForm
        key={open ? "open" : "closed"}
        accounts={accounts}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        isPending={isPending}
        onClose={onClose}
      />
    </Dialog>
  );
};
