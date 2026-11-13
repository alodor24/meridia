import * as Yup from "yup";

export const goalValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(80, "El nombre no puede superar los 80 caracteres")
    .required("El nombre es requerido"),
  accountId: Yup.string().required("Selecciona una cuenta de ahorro"),
  targetAmount: Yup.number()
    .typeError("El monto objetivo debe ser un número")
    .positive("El monto objetivo debe ser mayor a cero")
    .max(9_999_999_999.99, "Monto demasiado grande")
    .required("El monto objetivo es requerido"),
  targetDate: Yup.string(),
  description: Yup.string().trim().max(255, "Máximo 255 caracteres"),
  icon: Yup.string(),
  color: Yup.string().required("Elige un color"),
});

interface ContributionValidationContext {
  sourceLimits: Record<string, number>;
  remainingAmount: number;
}

export const buildContributionValidationSchema = ({
  sourceLimits,
  remainingAmount,
}: ContributionValidationContext) =>
  Yup.object({
    sourceAccountId: Yup.string().required("Selecciona una cuenta de origen"),
    amount: Yup.number()
      .typeError("El monto debe ser un número")
      .positive("El monto debe ser mayor a cero")
      .max(9_999_999_999.99, "Monto demasiado grande")
      .required("El monto es requerido")
      .test(
        "available-balance",
        "Saldo insuficiente en la cuenta de origen",
        function (value) {
          const sourceAccountId = this.parent.sourceAccountId as string;
          if (!value || !sourceAccountId) return true;
          const limit = sourceLimits[sourceAccountId] ?? 0;
          return Math.round(Number(value) * 100) <= Math.round(limit * 100);
        },
      )
      .test(
        "remaining-amount",
        "El monto supera lo que falta para completar la meta",
        (value) =>
          !value ||
          Math.round(Number(value) * 100) <= Math.round(remainingAmount * 100),
      ),
  });

export const buildReleaseValidationSchema = (maxAmount: number) =>
  Yup.object({
    amount: Yup.number()
      .typeError("El monto debe ser un número")
      .positive("El monto debe ser mayor a cero")
      .max(9_999_999_999.99, "Monto demasiado grande")
      .required("El monto es requerido")
      .test(
        "available-saved",
        "No puedes liberar más de lo reservado",
        (value) =>
          !value ||
          Math.round(Number(value) * 100) <= Math.round(maxAmount * 100),
      ),
  });
