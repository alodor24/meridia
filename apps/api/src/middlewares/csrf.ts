import type { NextFunction, Request, Response } from 'express';
import { env, isProd } from '../config/env';
import { AuthorizationError } from '../shared/errors';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

/**
 * Mitigación CSRF (defensa en profundidad).
 * Con cookies SameSite=Lax, los ataques cross-site son limitados. Además,
 * se rechazan las peticiones mutantes cuyo header Origin no coincida con
 * un origen permitido.
 */
export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  if (isMutation) {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      next(new AuthorizationError('Origin no permitido'));
      return;
    }
    if (!origin && isProd && req.headers.host && !allowedOrigins.some((o) => o.includes(req.headers.host!))) {
      next(new AuthorizationError('Origen no permitido'));
      return;
    }
  }

  next();
};