import { ACCOUNT_TYPE_OPTIONS } from "@/utils/labels";
import { AccountType } from "@meridia/shared";
import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(80, "Demasiado largo")
    .required("El nombre es requerido"),
  type: Yup.mixed<AccountType>()
    .oneOf(ACCOUNT_TYPE_OPTIONS.map((o) => o.value))
    .required("Seleccioná un tipo"),
  currency: Yup.string()
    .trim()
    .length(3, "Moneda inválida")
    .required("La moneda es requerida"),
});