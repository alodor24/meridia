import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { pool } from '../database/pool';
import { AuthenticationError } from '../shared/errors';
import * as usersRepository from '../modules/users/users.repository';
import type { UserId } from '@meridia/shared';

interface AccessTokenPayload {
  sub: UserId;
  email: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    next(new AuthenticationError());
    return;
  }

  let payload: AccessTokenPayload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    next(new AuthenticationError('Invalid or expired access token', 'INVALID_ACCESS_TOKEN'));
    return;
  }

  const userRow = await usersRepository.findById(pool, payload.sub);
  if (!userRow) {
    next(new AuthenticationError());
    return;
  }

  req.user = usersRepository.mapUserRow(userRow);
  next();
};