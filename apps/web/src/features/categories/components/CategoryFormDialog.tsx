import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { Category, TransactionType } from "@meridia/shared";
import CategoryForm from "./CategoryForm";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useCreateCategory } from "../hooks/useCreateCategory";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import CategoryIcon from "@mui/icons-material/Category";

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
      <Stack direction="row" sx={{ alignItems: "center", px: 3, pt: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "secondary.main",
            color: "primary.contrastText",
          }}>
          <CategoryIcon />
        </Avatar>
        <DialogTitle>
          {category ? "Editar categoría" : "Nueva categoría"}
        </DialogTitle>
      </Stack>

      <CategoryForm
        category={category}
        defaultType={defaultType}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Dialog>
  );
};
