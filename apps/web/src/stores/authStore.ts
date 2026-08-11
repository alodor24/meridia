import { create } from 'zustand';
import type { User } from '@meridia/shared';
import { tokenManager } from '@/services/api/tokenManager';
import * as authApi from '@/features/auth/api';
import type { LoginPayload, RegisterPayload } from '@/features/auth/api';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  setSession: (session: { user: User; accessToken: string | null }) => void;
  clearSession: () => void;
  bootstrap: () => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  status: 'idle',

  setSession: ({ user, accessToken }) => {
    tokenManager.setAccessToken(accessToken);
    set({ user, accessToken, status: 'authenticated' });
  },

  clearSession: () => {
    tokenManager.clear();
    set({ user: null, accessToken: null, status: 'unauthenticated' });
  },

  bootstrap: async () => {
    set({ status: 'loading' });
    try {
      const user = await authApi.getMe();
      get().setSession({ user, accessToken: tokenManager.getAccessToken() });
    } catch {
      get().clearSession();
    }
  },

  loginUser: async (payload) => {
    const session = await authApi.login(payload);
    get().setSession(session);
  },

  registerUser: async (payload) => {
    const session = await authApi.register(payload);
    get().setSession(session);
  },

  logoutUser: async () => {
    try {
      await authApi.logout();
    } finally {
      get().clearSession();
    }
  },

  refreshProfile: async () => {
    const user = await authApi.getMe();
    set({ user });
  },
}));

tokenManager.setOnUnauthorized(() => {
  useAuthStore.getState().clearSession();
});
