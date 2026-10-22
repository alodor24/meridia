import { User } from "@meridia/shared";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  country: string;
  currency: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
  avatarPublicId?: string;
}
