import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../shared/errors';

type RequestPart = 'body' | 'query' | 'params';

interface ValidatedLocals extends Record<string, unknown> {
  validatedQuery?: unknown;
}

export const validate = (schema: ZodSchema, part: RequestPart = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const details = result.error.flatten();
      next(new ValidationError('Invalid request', details));
      return;
    }
    if (part === 'query') {
      // En Express 5 req.query es un getter de solo lectura: no se puede reasignar.
      (res.locals as ValidatedLocals).validatedQuery = result.data;
    } else {
      (req as Request & { [k: string]: unknown })[part] = result.data;
    }
    next();
  };
}
