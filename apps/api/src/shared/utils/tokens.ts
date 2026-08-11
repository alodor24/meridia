import crypto from 'node:crypto';

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateTokenHash(token: string): string {
  return hashRefreshToken(token);
}
