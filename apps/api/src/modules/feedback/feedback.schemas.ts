import { FEEDBACK_TYPES } from "@meridia/shared";
import { z } from "zod";

export const createFeedbackSchema = z.object({
  type: z.enum(FEEDBACK_TYPES, { error: "Tipo de feedback inválido" }),
  subject: z
    .string({ error: "El asunto es requerido" })
    .trim()
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(120, "El asunto no puede superar los 120 caracteres"),
  message: z
    .string({ error: "El mensaje es requerido" })
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(4000, "El mensaje no puede superar los 4000 caracteres"),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
