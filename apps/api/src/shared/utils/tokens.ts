import crypto from 'node:crypto';

export const generateRefreshToken = (): string => crypto.randomBytes(48).toString('base64url');

export const hashRefreshToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateTokenHash = (token: string): string => hashRefreshToken(token);