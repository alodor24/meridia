const STORAGE_KEY = 'meridia_access_token';

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

const readFromStorage = (): string | null => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeToStorage = (token: string | null): void => {
  try {
    if (token) {
      window.sessionStorage.setItem(STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage no disponible (SSR/privacy mode): seguimos solo en memoria
  }
};

export const tokenManager = {
  getAccessToken(): string | null {
    return accessToken ?? readFromStorage();
  },
  setAccessToken(token: string | null): void {
    accessToken = token;
    writeToStorage(token);
  },
  clear(): void {
    accessToken = null;
    writeToStorage(null);
  },
  setOnUnauthorized(handler: () => void): void {
    onUnauthorized = handler;
  },
  handleUnauthorized(): void {
    onUnauthorized?.();
  },
};
