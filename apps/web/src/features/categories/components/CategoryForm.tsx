import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Formik, Form } from "formik";
import type { Category, TransactionType } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { ColorField } from "@/components/ui/ColorField";
import { useUiStore } from "@/stores/uiStore";
import { validationSchema } from "../validations";
import CategoryIconPicker from "./CategoryIconPicker";
import { toApiError } from "@/services/api/errors";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";

interface FormValues {
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

interface CategoryFormProps {
  category: Category | null;
  defaultType: TransactionType;
  onClose: () => void;
  onSaved: () => void;
}

const CategoryForm = ({
  category,
  defaultType,
  onClose,
  onSaved,
}: CategoryFormProps) => {
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();

  const initialValues: FormValues = category
    ? {
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      }
    : { name: "", type: defaultType, color: "#607d8b", icon: undefined };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (category) {
        await updateCategory({ id: category.id, payload: values });
        showSnackbar("Categoría actualizada");
        onSaved();
        return;
      }
      await createCategory(values);
      showSnackbar("Categoría creada");
      onSaved();
    } catch (error) {
      showSnackbar(toApiError(error).message, "error");
    }
  };

  return (
    <Formik
      key={category?.id ?? "new"}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        return (
          <Form>
            <DialogContent>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={values.type}
                onChange={(_, next: TransactionType | null) => {
                  if (next) {
                    void setFieldValue("type", next);
                    void setFieldValue("categoryId", "");
                  }
                }}
                aria-label="Tipo de categoría"
                sx={{ mb: 2, mt: 1 }}>
                <ToggleButton value="expense" color="error">
                  Gasto
                </ToggleButton>
                <ToggleButton value="income" color="success">
                  Ingreso
                </ToggleButton>
              </ToggleButtonGroup>

              <FormTextField
                name="name"
                label="Nombre"
                placeholder="Ej: Supermercado"
              />
              <ColorField name="color" />
              <CategoryIconPicker name="icon" label="Icono" />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={onClose}
                disabled={isCreating || isUpdating}
                color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={isCreating || isUpdating}
                loadingPosition="start">
                Guardar
              </Button>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CategoryForm;
