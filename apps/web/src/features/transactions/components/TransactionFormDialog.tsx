import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account, Category, Transaction } from "@meridia/shared";
import { useAsyncAction } from "@/hooks/useAsync";
import TransactionForm from "./TransactionForm";

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
  const { loading } = useAsyncAction();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
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
