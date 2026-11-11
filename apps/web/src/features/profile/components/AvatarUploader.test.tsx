import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User, UserId } from "@meridia/shared";
import { useUiStore } from "@/stores/uiStore";
import AvatarUploader from "./AvatarUploader";

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  uploadAvatar: vi.fn(),
  resizeAvatarImage: vi.fn(),
  validateAvatarFile: vi.fn(),
}));

vi.mock("../hooks/useUpdateAvatar", () => ({
  useUpdateAvatar: () => ({
    mutateAsync: mocks.mutateAsync,
    isPending: false,
  }),
}));

vi.mock("../services/uploadAvatar", () => ({
  uploadAvatar: mocks.uploadAvatar,
}));

vi.mock("../utils/avatarImage", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../utils/avatarImage")>();

  return {
    ...actual,
    resizeAvatarImage: mocks.resizeAvatarImage,
    validateAvatarFile: mocks.validateAvatarFile,
  };
});

const user: User = {
  id: "user-id" as UserId,
  email: "ana@test.com",
  name: "Ana",
  country: "AR",
  currency: "ARS",
  avatar: null,
  avatarPublicId: null,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const avatarUrl =
  "https://res.cloudinary.com/demo/image/upload/v123/meridia/avatars/avatar.webp";
const avatarPublicId = "meridia/avatars/user-id/avatar";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeEach(() => {
  mocks.mutateAsync.mockReset().mockResolvedValue(user);
  mocks.uploadAvatar
    .mockReset()
    .mockResolvedValue({ secureUrl: avatarUrl, publicId: avatarPublicId });
  mocks.resizeAvatarImage
    .mockReset()
    .mockImplementation(async () =>
      new File(["webp"], "avatar.webp", { type: "image/webp" }),
    );
  mocks.validateAvatarFile.mockReset().mockReturnValue(null);

  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn(() => "blob:avatar-preview"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });

  useUiStore.setState({
    snackbar: { open: false, message: "", severity: "info" },
  });
});

afterEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: originalCreateObjectURL,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: originalRevokeObjectURL,
  });
});

const getFileInput = (container: HTMLElement): HTMLInputElement => {
  const input = container.querySelector<HTMLInputElement>(
    'input[type="file"]',
  );

  if (!input) throw new Error("No se encontró el input de archivos");

  return input;
};

describe("AvatarUploader", () => {
  it("sube una imagen válida y actualiza el avatar", async () => {
    const { container } = render(<AvatarUploader user={user} />);
    const file = new File(["imagen"], "avatar.png", { type: "image/png" });

    await userEvent.upload(getFileInput(container), file);

    await waitFor(() => {
      expect(mocks.uploadAvatar).toHaveBeenCalledWith(
        expect.objectContaining({ name: "avatar.webp", type: "image/webp" }),
        user.id,
      );
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        avatar: avatarUrl,
        avatarPublicId,
      });
    });

    await waitFor(() => {
      expect(useUiStore.getState().snackbar.message).toBe(
        "Avatar actualizado",
      );
    });
  });

  it("rechaza imágenes de más de 2 MB", async () => {
    const { container } = render(<AvatarUploader user={user} />);
    const file = new File(
      [new Uint8Array(2 * 1024 * 1024 + 1)],
      "avatar.png",
      { type: "image/png" },
    );

    await userEvent.upload(getFileInput(container), file);

    await waitFor(() => {
      expect(useUiStore.getState().snackbar.message).toBe(
        "La imagen no puede superar los 2 MB.",
      );
    });
    expect(mocks.uploadAvatar).not.toHaveBeenCalled();
  });
});
