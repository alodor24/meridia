import * as Yup from "yup";
import { TransactionType } from "@meridia/shared";

export const buildValidationSchema = () => {
  return Yup.object({
    accountId: Yup.string().required("Selecciona una cuenta"),
    categoryId: Yup.string().required("Selecciona una categoría"),
    type: Yup.mixed<TransactionType>().oneOf(["income", "expense"]).required(),
    amount: Yup.number()
      .typeError("El monto debe ser un número")
      .positive("El monto debe ser mayor a cero")
      .max(9_999_999_999.99, "Monto demasiado grande")
      .required("El monto es requerido"),
    date: Yup.string().required("La fecha es requerida"),
    note: Yup.string().max(255, "La nota no puede superar los 255 caracteres"),
  });
};