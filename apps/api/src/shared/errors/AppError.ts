export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, new.target);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Solicitud inválida", details?: unknown) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Autenticación requerida", code = "UNAUTHENTICATED") {
    super(401, code, message);
  }
}

export class EmailNotVerifiedError extends AppError {
  constructor(message = "Debes verificar tu email antes de continuar") {
    super(403, "EMAIL_NOT_VERIFIED", message);
  }
}

export class InvalidVerificationTokenError extends AppError {
  constructor(message = "El enlace de verificación es inválido o expiró") {
    super(400, "INVALID_VERIFICATION_TOKEN", message);
  }
}

export class InvalidPasswordResetTokenError extends AppError {
  constructor(
    message = "El enlace para restablecer la contraseña es inválido o expiró",
  ) {
    super(400, "INVALID_PASSWORD_RESET_TOKEN", message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "No tienes permisos para realizar esta acción") {
    super(403, "FORBIDDEN", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto de recurso", code = "CONFLICT") {
    super(409, code, message);
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
