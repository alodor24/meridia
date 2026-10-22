import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AVATAR_MAX_SIZE_BYTES,
  AVATAR_SIZE,
  resizeAvatarImage,
  validateAvatarFile,
} from "./avatarImage";

const createFile = (
  name: string,
  type: string,
  size = 1024,
): File => new File([new Uint8Array(size)], name, { type });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("validateAvatarFile", () => {
  it("acepta JPG, JPEG y PNG", () => {
    expect(
      validateAvatarFile(createFile("avatar.jpg", "image/jpeg")),
    ).toBeNull();
    expect(
      validateAvatarFile(createFile("avatar.jpeg", "image/jpeg")),
    ).toBeNull();
    expect(
      validateAvatarFile(createFile("avatar.png", "image/png")),
    ).toBeNull();
  });

  it("rechaza formatos no permitidos", () => {
    expect(validateAvatarFile(createFile("avatar.gif", "image/gif"))).toBe(
      "Formato no permitido. Usa JPG, JPEG o PNG.",
    );
    expect(
      validateAvatarFile(createFile("avatar.webp", "image/webp")),
    ).toBe("Formato no permitido. Usa JPG, JPEG o PNG.");
  });

  it("rechaza archivos de más de 2 MB", () => {
    const file = createFile(
      "avatar.png",
      "image/png",
      AVATAR_MAX_SIZE_BYTES + 1,
    );

    expect(validateAvatarFile(file)).toBe(
      "La imagen no puede superar los 2 MB.",
    );
  });
});

describe("resizeAvatarImage", () => {
  it("recorta al centro y genera un archivo WebP de 512x512", async () => {
    const close = vi.fn();
    const bitmap = {
      width: 1024,
      height: 768,
      close,
    };
    const drawImage = vi.fn();
    const blob = new Blob(["webp"], { type: "image/webp" });

    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage,
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "low",
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback) => callback(blob),
    );

    const result = await resizeAvatarImage(
      createFile("foto.png", "image/png"),
    );

    expect(drawImage).toHaveBeenCalledWith(
      bitmap,
      (1024 - 768) / 2,
      0,
      768,
      768,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );
    expect(result.name).toBe("foto.webp");
    expect(result.type).toBe("image/webp");
    expect(close).toHaveBeenCalled();
  });
});
