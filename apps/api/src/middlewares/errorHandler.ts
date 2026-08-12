import type { NextFunction, Request, Response } from 'express';
import { env, isProd } from '../config/env';
import { isAppError } from '../shared/errors';
import { logger } from '../shared/logger';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' },
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (!isProd && !env.NODE_ENV.includes('test')) {
    logger.error({ err: error }, 'Error no controlado');
  }

  const message = isProd
    ? 'Internal server error'
    : error instanceof Error
      ? error.message
      : 'Internal server error';

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message },
  });
};