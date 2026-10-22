import { createHash } from "node:crypto";
import { env } from "../../config/env";
import { logger } from "../../shared/logger";

const DESTROY_TIMEOUT_MS = 10_000;

interface CloudinaryDestroyResponse {
  result?: string;
  error?: {
    message?: string;
  };
}

export const isCloudinaryDeletionConfigured = (): boolean => {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  return Boolean(cloudName && apiKey && apiSecret);
};

export const deleteCloudinaryAsset = async (
  publicId: string,
): Promise<boolean> => {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    logger.warn(
      { publicId },
      "Cloudinary no configurado; se omite el borrado del avatar anterior",
    );
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(
      `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`,
    )
    .digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
    invalidate: "true",
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DESTROY_TIMEOUT_MS);

  const CLOUDINARY_DESTROY_ENDPOINT = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await fetch(CLOUDINARY_DESTROY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    const data = (await response
      .json()
      .catch(() => ({}))) as CloudinaryDestroyResponse;

    if (!response.ok) {
      logger.warn(
        { publicId, error: data.error?.message },
        "No se pudo borrar el avatar anterior en Cloudinary",
      );
      return false;
    }

    if (data.result !== "ok" && data.result !== "not found") {
      logger.warn(
        { publicId, result: data.result },
        "Cloudinary no confirmó el borrado del avatar",
      );
      return false;
    }

    return true;
  } catch (error) {
    logger.warn(
      { publicId, error },
      "Error al borrar el avatar anterior en Cloudinary",
    );
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};
