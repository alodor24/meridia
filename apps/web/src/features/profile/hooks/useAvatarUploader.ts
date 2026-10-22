import { useCallback, useEffect, useRef, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { toApiError } from "@/services/api/errors";
import { useUpdateAvatar } from "./useUpdateAvatar";
import { resizeAvatarImage, validateAvatarFile } from "../utils/avatarImage";
import { uploadAvatar } from "../services/uploadAvatar";
import { UseAvatarUploaderParams } from "../types";

export const useAvatarUploader = ({ userId }: UseAvatarUploaderParams) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const { mutateAsync, isPending } = useUpdateAvatar();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processingRef = useRef(false);
  const isBusy = isProcessing || isPending;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = useCallback(
    async (file: File) => {
      if (processingRef.current) return;

      const validationError = validateAvatarFile(file);

      if (validationError) {
        showSnackbar(validationError, "error");
        return;
      }

      processingRef.current = true;
      setIsProcessing(true);

      try {
        const resizedFile = await resizeAvatarImage(file);

        const objectUrl = URL.createObjectURL(resizedFile);
        setPreviewUrl(objectUrl);

        const { secureUrl, publicId } = await uploadAvatar(resizedFile, userId);

        await mutateAsync({
          avatar: secureUrl,
          avatarPublicId: publicId,
        });

        setPreviewUrl(null);
        showSnackbar("Avatar actualizado");
      } catch (error: unknown) {
        setPreviewUrl(null);
        showSnackbar(toApiError(error).message, "error");
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    },
    [mutateAsync, showSnackbar, userId],
  );

  return {
    processFile,
    previewUrl,
    isBusy,
  };
};
