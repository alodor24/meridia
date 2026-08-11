import type { User } from '@meridia/shared';
import { http } from '@/services/api/client';

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
  http.post<AuthResponse>('/api/auth/register', payload);

export const login = (payload: LoginPayload) =>
  http.post<AuthResponse>('/api/auth/login', payload);

export const logout = () =>
  http.post<null>('/api/auth/logout');

export const getMe = () =>
  http.get<{ user: User }>('/api/auth/me').then((r) => r.user);

export const updateProfile = (name: string) =>
  http.patch<{ user: User }>('/api/auth/me', { name }).then((r) => r.user);
