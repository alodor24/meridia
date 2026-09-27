import { Button, DialogActions, DialogContent } from "@mui/material";
import { Formik, Form } from "formik";
import type { Category, TransactionType } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { ColorField } from "@/components/ui/ColorField";
import { useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { createCategory, updateCategory } from "../services/api";
import { validationSchema } from "../validations";
import CategoryIconPicker from "./CategoryIconPicker";

const TYPE_OPTIONS = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
];

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
  const { loading, run } = useAsyncAction();

  const initialValues: FormValues = category
    ? {
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      }
    : { name: "", type: defaultType, color: "#607d8b", icon: undefined };

  const handleSubmit = async (values: FormValues) => {
    const result = await run(async () => {
      if (category) {
        await updateCategory(category.id, values);
        return "Categoría actualizada";
      }
      await createCategory(values);
      return "Categoría creada";
    });
    if (result) {
      showSnackbar(result);
      onSaved();
    }
  };

  return (
    <Formik
      key={category?.id ?? "new"}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {() => (
        <Form>
          <DialogContent>
            <FormTextField
              name="name"
              label="Nombre"
              placeholder="Ej: Supermercado"
            />
            <FormSelect name="type" label="Tipo" options={TYPE_OPTIONS} />
            <ColorField name="color" />
            <CategoryIconPicker name="icon" label="Icono" />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} disabled={loading} color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              loadingPosition="start">
              Guardar
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
