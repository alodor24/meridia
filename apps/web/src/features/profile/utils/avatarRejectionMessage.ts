import type { FileRejection } from "react-dropzone";

const REJECTION_MESSAGES: Record<string, string> = {
  "file-too-large": "La imagen no puede superar los 2 MB.",
  "file-invalid-type": "Formato no permitido. Usa JPG, JPEG o PNG.",
  "too-many-files": "Selecciona una sola imagen.",
};

export const getAvatarRejectionMessage = (
  rejections: readonly FileRejection[],
): string => {
  const code = rejections[0]?.errors[0]?.code;

  return (
    REJECTION_MESSAGES[code ?? ""] ??
    "No se pudo validar la imagen seleccionada."
  );
};
