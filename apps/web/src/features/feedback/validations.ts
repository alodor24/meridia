import { FEEDBACK_TYPES, type FeedbackType } from "@meridia/shared";
import * as Yup from "yup";

export const feedbackValidationSchema = Yup.object({
  type: Yup.mixed<FeedbackType>()
    .oneOf([...FEEDBACK_TYPES], "Selecciona un tipo de mensaje")
    .required("Selecciona un tipo de mensaje"),
  subject: Yup.string()
    .trim()
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(120, "El asunto no puede superar los 120 caracteres")
    .required("El asunto es requerido"),
  message: Yup.string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(4000, "El mensaje no puede superar los 4000 caracteres")
    .required("El mensaje es requerido"),
});
