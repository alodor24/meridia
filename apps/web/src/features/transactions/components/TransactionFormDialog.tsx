import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Account, Category, Transaction } from "@meridia/shared";
import TransactionForm from "./TransactionForm";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import { useUpdateTransaction } from "../hooks/useUpdateTransaction";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ReceiptIcon from "@mui/icons-material/Receipt";

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
      <Stack direction="row" sx={{ alignItems: "center", px: 3, pt: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "secondary.main",
            color: "primary.contrastText",
          }}>
          <ReceiptIcon />
        </Avatar>
        <DialogTitle>
          {transaction ? "Editar movimiento" : "Nuevo movimiento"}
        </DialogTitle>
      </Stack>

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
