import type { User } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";
import { AuthResponse, LoginPayload, RegisterPayload } from "../types";

export const authApi = {
  login: (payload: LoginPayload) =>
    http.post<AuthResponse>(
      ENDPOINT_ROUTES.LOGIN,
      payload,
    ),

  register: (payload: RegisterPayload) =>
    http.post<AuthResponse>(
      ENDPOINT_ROUTES.REGISTER,
      payload,
    ),

  logout: () =>
    http.post<null>(
      ENDPOINT_ROUTES.LOGOUT,
    ),

  getMe: async (): Promise<User> => {
    const result = await http.get<{ user: User }>(
      ENDPOINT_ROUTES.ME,
    );

    return result.user;
  },

  updateProfile: async (name: string): Promise<User> => {
    const result = await http.patch<{ user: User }>(
      ENDPOINT_ROUTES.ME,
      { name },
    );

    return result.user;
  },
};
