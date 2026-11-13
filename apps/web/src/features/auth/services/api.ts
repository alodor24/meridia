import type { User } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/consts";
import {
  AuthResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  UpdateProfilePayload,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "../types";

export const authApi = {
  login: (payload: LoginPayload) =>
    http.post<AuthResponse>(ENDPOINT_ROUTES.LOGIN, payload),

  register: (payload: RegisterPayload) =>
    http.post<RegisterResponse>(ENDPOINT_ROUTES.REGISTER, payload),

  verifyEmail: (payload: VerifyEmailPayload) =>
    http.post<VerifyEmailResponse>(ENDPOINT_ROUTES.VERIFY_EMAIL, payload),

  resendVerification: (payload: ResendVerificationPayload) =>
    http.post<ResendVerificationResponse>(
      ENDPOINT_ROUTES.RESEND_VERIFICATION,
      payload,
    ),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    http.post<ForgotPasswordResponse>(ENDPOINT_ROUTES.FORGOT_PASSWORD, payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    http.post<ResetPasswordResponse>(ENDPOINT_ROUTES.RESET_PASSWORD, payload),

  logout: () => http.post<null>(ENDPOINT_ROUTES.LOGOUT),

  getMe: async (): Promise<User> => {
    const result = await http.get<{ user: User }>(ENDPOINT_ROUTES.ME);

    return result.user;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const result = await http.patch<{ user: User }>(
      ENDPOINT_ROUTES.ME,
      payload,
    );

    return result.user;
  },
};
