import * as Yup from "yup";
import { TransactionType } from "@meridia/shared";

export const validationSchema = Yup.object({
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