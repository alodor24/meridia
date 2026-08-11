import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { pool, withTransaction } from '../../database/pool';
import type { Db } from '../../database/types';
import { AuthenticationError, ConflictError, NotFoundError } from '../../shared/errors';
import { expiresInToMs } from '../../shared/utils/money';
import { generateRefreshToken, hashRefreshToken } from '../../shared/utils/tokens';
import * as authRepository from './auth.repository';
import * as usersRepository from '../users/users.repository';
import type { TokenPair } from './auth.types';
import type { LoginInput, RegisterInput } from './auth.schemas';

const BCRYPT_ROUNDS = 10;

function signAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );
}

async function issueTokenPair(db: Db, userId: string, email: string): Promise<TokenPair> {
  const accessToken = signAccessToken(userId, email);
  const refreshToken = generateRefreshToken();
  await authRepository.createRefreshToken(db, {
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + expiresInToMs(env.JWT_REFRESH_EXPIRES_IN)),
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existing = await usersRepository.findByEmail(pool, email);
  if (existing) {
    throw new ConflictError('Ya existe una cuenta con ese email', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await withTransaction(async (client) => {
    const created = await usersRepository.create(client, {
      name: input.name.trim(),
      email,
      passwordHash,
      country: input.country,
      currency: input.currency,
    });
    await authRepository.createDefaultCategories(client, created.id);
    return created;
  });

  const tokens = await issueTokenPair(pool, user.id, user.email);

  return { user: usersRepository.mapUserRow(user), ...tokens };
}

export async function login(input: LoginInput) {
  const email = input.email.trim().toLowerCase();
  const user = await usersRepository.findByEmail(pool, email);

  const passwordValid = user
    ? await bcrypt.compare(input.password, user.password_hash)
    : false;

  if (!user || !passwordValid) {
    throw new AuthenticationError('Credenciales inválidas', 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokenPair(pool, user.id, user.email);

  return { user: usersRepository.mapUserRow(user), ...tokens };
}

export async function refresh(refreshToken: string) {
  const record = await authRepository.findValidRefreshToken(
    pool,
    hashRefreshToken(refreshToken),
  );

  if (!record) {
    throw new AuthenticationError('Refresh token inválido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  const tokens = await withTransaction(async (client) => {
    await authRepository.revokeRefreshTokenById(client, record.id);
    return issueTokenPair(client, record.user.id, record.user.email);
  });

  return {
    user: usersRepository.mapUserRow(record.user),
    ...tokens,
  };
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await authRepository.revokeRefreshToken(pool, hashRefreshToken(refreshToken));
}

export async function getMe(userId: string) {
  const user = await usersRepository.findById(pool, userId);
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return usersRepository.mapUserRow(user);
}

export async function updateProfile(userId: string, name: string) {
  const user = await usersRepository.updateName(pool, userId, name.trim());
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return usersRepository.mapUserRow(user);
}
