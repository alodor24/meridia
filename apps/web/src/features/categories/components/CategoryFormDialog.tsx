import { Dialog, DialogTitle } from "@mui/material";
import type { Category, TransactionType } from "@meridia/shared";
import { useAsyncAction } from "@/hooks/useAsync";
import CategoryForm from "./CategoryForm";

export interface CategoryFormDialogProps {
  open: boolean;
  category: Category | null;
  defaultType: TransactionType;
  onClose: () => void;
  onSaved: () => void;
}

export const CategoryFormDialog = ({
  open,
  category,
  defaultType,
  onClose,
  onSaved,
}: CategoryFormDialogProps) => {
  const { loading } = useAsyncAction();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle>
        {category ? "Editar categoría" : "Nueva categoría"}
      </DialogTitle>
      <CategoryForm
        category={category}
        defaultType={defaultType}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
