export class ApiError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly status?: number;

  constructor(message: string, code = 'REQUEST_FAILED', details?: unknown, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

interface ErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (error instanceof Object && 'response' in error) {
    const response = (error as { response?: { data?: { error?: ErrorPayload }; status?: number } }).response;
    const payload = response?.data?.error;
    if (payload?.message) {
      return new ApiError(payload.message, payload.code ?? 'REQUEST_FAILED', payload.details, response?.status);
    }
    if (response?.status === 401) {
      return new ApiError('Tu sesión expiró. Iniciá sesión nuevamente.', 'UNAUTHENTICATED', undefined, 401);
    }
    if (response?.status === 403) {
      return new ApiError('No tenés permiso para realizar esta acción.', 'FORBIDDEN', undefined, 403);
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'REQUEST_FAILED');
  }

  return new ApiError('Error inesperado. Intentalo de nuevo.', 'REQUEST_FAILED');
}
