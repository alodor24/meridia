import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Category, TransactionType } from "@meridia/shared";
import CategoryForm from "./CategoryForm";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useCreateCategory } from "../hooks/useCreateCategory";

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
  const { isPending: isCreating } = useCreateCategory();
  const { isPending: isUpdating } = useUpdateCategory();

  return (
    <Dialog
      open={open}
      onClose={isCreating || isUpdating ? undefined : onClose}
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
