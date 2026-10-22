export const AVATAR_SIZE = 512;
export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = ["jpg", "jpeg", "png"];

const decodeImage = async (file: File) => {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });

      return {
        source: bitmap as CanvasImageSource,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch (error) {
      void error;
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    return {
      source: image as CanvasImageSource,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};

export const validateAvatarFile = (file: File): string | null => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const hasValidExtension =
    extension !== undefined && ACCEPTED_EXTENSIONS.includes(extension);
  const hasValidMimeType = ACCEPTED_MIME_TYPES.includes(file.type);

  if (!hasValidExtension || !hasValidMimeType) {
    return "Formato no permitido. Usa JPG, JPEG o PNG.";
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return "La imagen no puede superar los 2 MB.";
  }

  return null;
};

export const resizeAvatarImage = async (file: File): Promise<File> => {
  const decoded = await decodeImage(file);

  try {
    if (!decoded.width || !decoded.height) {
      throw new Error("No se pudo leer la imagen seleccionada.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No se pudo procesar la imagen seleccionada.");
    }

    const sourceSize = Math.min(decoded.width, decoded.height);
    const sourceX = (decoded.width - sourceSize) / 2;
    const sourceY = (decoded.height - sourceSize) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      decoded.source,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.9);
    });

    if (!blob) {
      throw new Error("No se pudo generar la imagen de perfil.");
    }

    if (blob.type !== "image/webp") {
      throw new Error("Tu navegador no permite generar imágenes WebP.");
    }

    if (blob.size > AVATAR_MAX_SIZE_BYTES) {
      throw new Error("La imagen procesada no puede superar los 2 MB.");
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "avatar";

    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    decoded.dispose();
  }
};
