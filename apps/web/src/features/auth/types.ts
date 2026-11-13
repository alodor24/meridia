import { User } from "@meridia/shared";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  verified: boolean;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  reset: boolean;
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
