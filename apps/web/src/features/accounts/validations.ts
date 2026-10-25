import { ACCOUNT_TYPE_OPTIONS } from "@/utils/labels";
import { Account, AccountType } from "@meridia/shared";
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

export const buildTransferValidationSchema = (accounts: Account[]) =>
  Yup.object({
    fromAccountId: Yup.string().required("Selecciona una cuenta de origen"),
    toAccountId: Yup.string()
      .required("Selecciona una cuenta de destino")
      .test(
        "different-account",
        "Las cuentas deben ser distintas",
        function (value) {
          return value !== this.parent.fromAccountId;
        },
      ),
    amount: Yup.number()
      .typeError("El monto debe ser un número")
      .positive("El monto debe ser mayor a cero")
      .max(9_999_999_999.99, "Monto demasiado grande")
      .required("El monto es requerido")
      .test(
        "available-balance",
        "Saldo insuficiente en la cuenta de origen",
        function (value) {
          const source = accounts.find(
            (account) => account.id === this.parent.fromAccountId,
          );
          if (!value || !source) return true;
          return (
            Math.round(Number(value) * 100) <= Math.round(source.balance * 100)
          );
        },
      ),
    note: Yup.string().max(255, "La nota no puede superar los 255 caracteres"),
  });
