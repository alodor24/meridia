import { User } from "@meridia/shared";

export interface UpdateAvatarInput {
  avatar: string;
  avatarPublicId: string;
}

export interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  format?: string;
  bytes?: number;
}

export interface CloudinaryErrorResponse {
  error?: {
    message?: string;
  };
}

export interface UploadedAvatar {
  secureUrl: string;
  publicId: string;
}

export interface UseAvatarUploaderParams {
  userId: User["id"];
}
