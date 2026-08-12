import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { tokenManager } from "./tokenManager";
import { toApiError } from "./errors";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
];

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        null,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = response.data?.data;
      if (!data?.accessToken) throw new Error("Respuesta de refresh inválida");
      tokenManager.setAccessToken(data.accessToken as string);
      return data.accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      (AxiosRequestConfig & { _retried?: boolean }) | undefined;

    const isAuthPath = original?.url
      ? AUTH_PATHS.some((p) => original.url!.includes(p))
      : false;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthPath
    ) {
      original._retried = true;
      try {
        const token = await refreshAccessToken();
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${token}`,
        };
        return client(original);
      } catch {
        tokenManager.handleUnauthorized();
      }
    }

    return Promise.reject(toApiError(error));
  },
);

const unwrap = async <T>(
  request: Promise<AxiosResponse<{ data: T }>>,
): Promise<T> => {
  const response = await request;
  return response.data.data;
};

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(client.get<{ data: T }>(url, config)),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(client.post<{ data: T }>(url, body, config)),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(client.patch<{ data: T }>(url, body, config)),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(client.delete<{ data: T }>(url, config)),
};

export const isAxiosError = (error: unknown): boolean =>
  error instanceof AxiosError || axios.isAxiosError(error);
