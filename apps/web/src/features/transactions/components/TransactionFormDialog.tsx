import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account, Category, Transaction } from "@meridia/shared";
import TransactionForm from "./TransactionForm";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import { useUpdateTransaction } from "../hooks/useUpdateTransaction";

export interface TransactionFormDialogProps {
  open: boolean;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export const TransactionFormDialog = ({
  open,
  transaction,
  accounts,
  categories,
  onClose,
  onSaved,
}: TransactionFormDialogProps) => {
  const { isPending: isCreating } = useCreateTransaction();
  const { isPending: isUpdating } = useUpdateTransaction();

  return (
    <Dialog
      open={open}
      onClose={isCreating || isUpdating ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>
        {transaction ? "Editar movimiento" : "Nuevo movimiento"}
      </DialogTitle>
      <TransactionForm
        transaction={transaction}
        accounts={accounts}
        categories={categories}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
