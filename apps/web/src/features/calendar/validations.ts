import * as Yup from "yup";
import { REMINDER_RECURRENCE_UNITS } from "@meridia/shared";

const title = Yup.string()
  .trim()
  .required("El título es requerido")
  .max(120, "El título no puede superar los 120 caracteres");

export const buildReminderValidationSchema = () =>
  Yup.object({
    title,
    date: Yup.string().required("La fecha es requerida"),
    repeat: Yup.boolean().required(),
    unit: Yup.string()
      .oneOf([...REMINDER_RECURRENCE_UNITS], "Unidad inválida")
      .when("repeat", {
        is: true,
        then: (schema) => schema.required("Selecciona una frecuencia"),
      }),
    interval: Yup.number()
      .typeError("El intervalo debe ser un número")
      .integer("El intervalo debe ser un número entero")
      .min(1, "El intervalo debe ser mayor a cero")
      .max(999, "El intervalo es demasiado grande")
      .when("repeat", {
        is: true,
        then: (schema) => schema.required("El intervalo es requerido"),
      }),
    endDate: Yup.string().when("repeat", {
      is: true,
      then: (schema) =>
        schema.test(
          "end-after-start",
          "La fecha de fin debe ser posterior o igual a la fecha de inicio",
          function (value) {
            if (!value) return true;
            return value >= this.parent.date;
          },
        ),
    }),
  });

export const buildOccurrenceValidationSchema = () =>
  Yup.object({
    title,
    date: Yup.string().required("La fecha es requerida"),
  });
