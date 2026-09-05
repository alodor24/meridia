import type { User } from "@meridia/shared";
import { http } from "@/services/api/client";
import { ENDPOINT_ROUTES } from "@/conts";

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

export const register = (payload: RegisterPayload) =>
  http.post<AuthResponse>(ENDPOINT_ROUTES.REGISTER, payload);

export const login = (payload: LoginPayload) =>
  http.post<AuthResponse>(ENDPOINT_ROUTES.LOGIN, payload);

export const logout = () => http.post<null>(ENDPOINT_ROUTES.LOGOUT);

export const getMe = async () => {
  const result = await http.get<{ user: User }>(ENDPOINT_ROUTES.ME);
  return result.user;
};

export const updateProfile = async (name: string) => {
  const result = await http.patch<{ user: User }>(ENDPOINT_ROUTES.ME, { name });
  return result.user;
};
