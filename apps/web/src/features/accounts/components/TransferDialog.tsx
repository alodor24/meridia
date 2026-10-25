import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account } from "@meridia/shared";
import { useTransferForm } from "../hooks/useTransferForm";
import { TransferForm } from "./TransferForm";

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
      <DialogTitle>Transferir saldo</DialogTitle>
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
