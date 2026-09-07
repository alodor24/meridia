import * as Yup from "yup";

export const profileValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(80, "Demasiado largo")
    .required("El nombre es requerido"),
});