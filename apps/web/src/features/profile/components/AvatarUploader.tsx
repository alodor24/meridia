import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { User } from "@meridia/shared";
import { SHADOW } from "@/theme/globalStyles";
import { useUiStore } from "@/stores/uiStore";
import { AVATAR_MAX_SIZE_BYTES } from "../utils/avatarImage";
import { useAvatarUploader } from "../hooks/useAvatarUploader";
import { getAvatarRejectionMessage } from "../utils/avatarRejectionMessage";

interface AvatarUploaderProps {
  user: User;
}

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const AvatarUploader = ({ user }: AvatarUploaderProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);

  const { processFile, previewUrl, isBusy } = useAvatarUploader({
    userId: user.id,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        showSnackbar(getAvatarRejectionMessage(fileRejections), "error");
        return;
      }

      const file = acceptedFiles[0];

      if (file) {
        void processFile(file);
      }
    },
    [processFile, showSnackbar],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FORMATS,
      maxSize: AVATAR_MAX_SIZE_BYTES,
      maxFiles: 1,
      multiple: false,
      disabled: isBusy,
    });

  const avatarUrl = previewUrl ?? user.avatar ?? undefined;

  const dropzoneMessage = isBusy
    ? "Procesando imagen…"
    : isDragActive
      ? "Suelta la imagen para subirla"
      : "Arrastra una imagen aquí o haz clic para seleccionar";

  return (
    <Card sx={{ boxShadow: SHADOW }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Foto de perfil
        </Typography>

        <Box
          {...getRootProps({
            "aria-label": "Subir foto de perfil",
          })}
          aria-busy={isBusy}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            p: 3,
            textAlign: "center",
            border: "2px dashed",
            borderColor: isDragReject
              ? "error.main"
              : isDragActive
                ? "primary.main"
                : "divider",
            borderRadius: 2,
            bgcolor: isDragActive ? "action.hover" : "transparent",
            cursor: isBusy ? "default" : "pointer",
            transition: "border-color 150ms ease, background-color 150ms ease",
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}>
          <input {...getInputProps()} />

          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <Avatar
              src={avatarUrl}
              alt={`Avatar de ${user.name}`}
              sx={{
                width: 96,
                height: 96,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: 36,
              }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            {isBusy && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  bgcolor: "rgba(0, 0, 0, 0.45)",
                }}>
                <CircularProgress size={28} sx={{ color: "common.white" }} />
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {dropzoneMessage}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              JPG, PNG o JPEG · Máx. 2 MB
            </Typography>
          </Box>

          <CloudUploadIcon color="action" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AvatarUploader;
