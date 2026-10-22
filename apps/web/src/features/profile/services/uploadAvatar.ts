import {
  CloudinaryErrorResponse,
  CloudinaryUploadResponse,
  UploadedAvatar,
} from "../types";

const UPLOAD_TIMEOUT_MS = 30_000;

export const uploadAvatar = async (
  file: File,
  userId: string,
): Promise<UploadedAvatar> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Falta configurar Cloudinary. Revisa VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `meridia/avatars/${userId}`);
  formData.append("public_id", crypto.randomUUID());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  const CLOUDINARY_UPLOAD_ENDPOINT = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
      credentials: "omit",
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = "";

      try {
        const errorBody = (await response.json()) as CloudinaryErrorResponse;
        detail = errorBody.error?.message ?? "";
      } catch (error) {
        void error;
      }

      throw new Error(
        detail
          ? `No se pudo subir la imagen: ${detail}`
          : "No se pudo subir la imagen. Intenta nuevamente.",
      );
    }

    const data = (await response.json()) as CloudinaryUploadResponse;

    if (!data.secure_url || !data.public_id) {
      throw new Error(
        "Cloudinary no devolvió la URL o el public_id de la imagen.",
      );
    }

    return { secureUrl: data.secure_url, publicId: data.public_id };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("La subida tardó demasiado. Intenta nuevamente.", {
        cause: error,
      });
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
