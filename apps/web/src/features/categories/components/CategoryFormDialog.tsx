import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { Category, TransactionType } from "@meridia/shared";
import { FormTextField } from "@/components/ui/FormTextField";
import { FormSelect } from "@/components/ui/FormSelect";
import { ColorField } from "@/components/ui/ColorField";
import { useAsyncAction } from "@/hooks/useAsync";
import { useUiStore } from "@/stores/uiStore";
import { createCategory, updateCategory } from "../api";

const TYPE_OPTIONS = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
];

interface FormValues {
  name: string;
  type: TransactionType;
  color: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(80, "Demasiado largo")
    .required("El nombre es requerido"),
  type: Yup.mixed<TransactionType>()
    .oneOf(["income", "expense"])
    .required("Seleccioná un tipo"),
  color: Yup.string()
    .matches(/^#[0-9a-fA-F]{6}$/, "Color inválido")
    .required("Elegí un color"),
});

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
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const { loading, run } = useAsyncAction();

  const initialValues: FormValues = category
    ? { name: category.name, type: category.type, color: category.color }
    : { name: "", type: defaultType, color: "#607d8b" };

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
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {category ? "Editar categoría" : "Nueva categoría"}
      </DialogTitle>
      <Formik
        key={category?.id ?? "new"}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <DialogContent>
              <FormTextField
                name="name"
                label="Nombre"
                autoFocus
                placeholder="Ej: Súper"
              />
              <FormSelect name="type" label="Tipo" options={TYPE_OPTIONS} />
              <ColorField name="color" />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onClose} disabled={loading} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Guardando…" : "Guardar"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
