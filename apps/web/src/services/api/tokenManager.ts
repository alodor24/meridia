const STORAGE_KEY = 'meridia_access_token';
const REFRESH_BUFFER_MS = 60_000;

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;
let onRefreshNeeded: (() => Promise<void>) | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

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

const decodeExpMs = (token: string): number | null => {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const payload = JSON.parse(atob(part));
    if (typeof payload.exp !== 'number') return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const clearRefreshTimer = (): void => {
  if (refreshTimer !== null) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const scheduleRefresh = (token: string): void => {
  clearRefreshTimer();
  const expiresAt = decodeExpMs(token);
  if (expiresAt === null || !onRefreshNeeded) return;

  const delay = expiresAt - Date.now() - REFRESH_BUFFER_MS;
  if (delay <= 0) {
    void onRefreshNeeded();
    return;
  }

  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    void onRefreshNeeded!();
  }, delay);
};

export const tokenManager = {
  getAccessToken(): string | null {
    return accessToken ?? readFromStorage();
  },
  setAccessToken(token: string | null): void {
    accessToken = token;
    writeToStorage(token);
    if (token) {
      scheduleRefresh(token);
    } else {
      clearRefreshTimer();
    }
  },
  clear(): void {
    accessToken = null;
    writeToStorage(null);
    clearRefreshTimer();
  },
  setOnUnauthorized(handler: () => void): void {
    onUnauthorized = handler;
  },
  handleUnauthorized(): void {
    clearRefreshTimer();
    onUnauthorized?.();
  },
  setOnRefreshNeeded(handler: () => Promise<void>): void {
    onRefreshNeeded = handler;
  },
};
