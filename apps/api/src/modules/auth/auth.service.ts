import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { pool, withTransaction } from '../../database/pool';
import type { Db } from '../../database/types';
import {
  AuthenticationError,
  ConflictError,
  EmailNotVerifiedError,
  InvalidPasswordResetTokenError,
  InvalidVerificationTokenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../../shared/email/mailer';
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateRefreshToken,
  hashEmailVerificationToken,
  hashPasswordResetToken,
  hashRefreshToken,
} from '../../shared/utils/tokens';
import { expiresInToMs } from '../../shared/utils/time';
import * as authRepository from './auth.repository';
import * as usersRepository from '../users/users.repository';
import { deleteCloudinaryAsset } from '../users/cloudinary';
import type { TokenPair } from './auth.types';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  ResetPasswordInput,
  UpdateProfileInput,
  VerifyEmailInput,
} from './auth.schemas';
import type { UserId } from '@meridia/shared';

const BCRYPT_ROUNDS = 10;
const EMAIL_VERIFICATION_TTL_MS =
  env.EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS =
  env.VERIFICATION_RESEND_COOLDOWN_SECONDS * 1000;
const PASSWORD_RESET_TTL_MS = env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000;
const PASSWORD_RESET_COOLDOWN_MS =
  env.PASSWORD_RESET_COOLDOWN_SECONDS * 1000;

export const GENERIC_RESEND_MESSAGE =
  'Si el email está registrado y aún no fue verificado, te enviamos un nuevo enlace.';

export const GENERIC_FORGOT_PASSWORD_MESSAGE =
  'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.';

interface EmailRecipient {
  id: UserId;
  email: string;
  name: string;
}

const signAccessToken = (userId: UserId, email: string): string =>
  jwt.sign(
    { sub: userId, email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );

const issueTokenPair = async (db: Db, userId: UserId, email: string): Promise<TokenPair> => {
  await authRepository.deleteExpiredRefreshTokensByUser(db, userId);

  const accessToken = signAccessToken(userId, email);
  const refreshToken = generateRefreshToken();

  await authRepository.createRefreshToken(db, {
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + expiresInToMs(env.JWT_REFRESH_EXPIRES_IN)),
  });
  return { accessToken, refreshToken };
};

const buildVerificationUrl = (token: string): string => {
  const url = new URL('/verify-email', env.WEB_APP_URL);
  url.searchParams.set('token', token);
  return url.toString();
};

const createVerificationToken = async (
  db: Db,
  user: EmailRecipient,
): Promise<string> => {
  const token = generateEmailVerificationToken();

  await authRepository.createEmailVerificationToken(db, {
    userId: user.id,
    tokenHash: hashEmailVerificationToken(token),
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
  });

  return token;
};

const sendVerification = async (
  user: EmailRecipient,
  token: string,
): Promise<void> => {
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    url: buildVerificationUrl(token),
    expiresInHours: env.EMAIL_VERIFICATION_TTL_HOURS,
  });
};

const buildPasswordResetUrl = (token: string): string => {
  const url = new URL('/reset-password', env.WEB_APP_URL);
  url.searchParams.set('token', token);
  return url.toString();
};

const createPasswordResetToken = async (
  db: Db,
  user: EmailRecipient,
): Promise<string> => {
  const token = generatePasswordResetToken();

  await authRepository.createPasswordResetToken(db, {
    userId: user.id,
    tokenHash: hashPasswordResetToken(token),
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  });

  return token;
};

const sendPasswordReset = async (
  user: EmailRecipient,
  token: string,
): Promise<void> => {
  await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    url: buildPasswordResetUrl(token),
    expiresInMinutes: env.PASSWORD_RESET_TTL_MINUTES,
  });
};

export const register = async (input: RegisterInput) => {
  const email = input.email.trim().toLowerCase();

  const existing = await usersRepository.findByEmail(pool, email);
  if (existing) {
    throw new ConflictError('Ya existe una cuenta con ese email', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const { user, token } = await withTransaction(async (client) => {
    const created = await usersRepository.create(client, {
      name: input.name.trim(),
      email,
      passwordHash,
      country: input.country,
      currency: input.currency,
    });

    const recipient: EmailRecipient = {
      id: created.id as UserId,
      email: created.email,
      name: created.name,
    };
    const verificationToken = await createVerificationToken(client, recipient);

    return { user: created, token: verificationToken };
  });

  await sendVerification(
    { id: user.id as UserId, email: user.email, name: user.name },
    token,
  );

  return {
    user: usersRepository.mapUserRow(user),
    message: 'Te enviamos un correo para verificar tu cuenta.',
  };
};

export const verifyEmail = async (input: VerifyEmailInput) => {
  const tokenHash = hashEmailVerificationToken(input.token);

  await withTransaction(async (client) => {
    const userId = await authRepository.consumeEmailVerificationToken(
      client,
      tokenHash,
    );

    if (!userId) {
      throw new InvalidVerificationTokenError();
    }

    const user = await usersRepository.findById(client, userId);
    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    if (!user.email_verified_at) {
      await usersRepository.markEmailVerified(client, userId);
      await authRepository.createDefaultCategories(client, userId);
    }
  });

  return { verified: true as const };
};

export const resendVerification = async (
  input: ResendVerificationInput,
): Promise<void> => {
  const email = input.email.trim().toLowerCase();
  const user = await usersRepository.findByEmail(pool, email);

  if (!user || user.email_verified_at) {
    return;
  }

  const userId = user.id as UserId;
  const latest = await authRepository.findLatestEmailVerificationToken(pool, userId);

  if (
    latest &&
    Date.now() - latest.created_at.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  ) {
    return;
  }

  const token = await withTransaction(async (client) => {
    await authRepository.deleteUnusedEmailVerificationTokens(client, userId);
    return createVerificationToken(client, {
      id: userId,
      email: user.email,
      name: user.name,
    });
  });

  await sendVerification(
    { id: userId, email: user.email, name: user.name },
    token,
  );
};

export const forgotPassword = async (
  input: ForgotPasswordInput,
): Promise<void> => {
  const email = input.email.trim().toLowerCase();
  const user = await usersRepository.findByEmail(pool, email);

  if (!user || !user.email_verified_at) {
    return;
  }

  const userId = user.id as UserId;
  const latest = await authRepository.findLatestPasswordResetToken(pool, userId);

  if (
    latest &&
    Date.now() - latest.created_at.getTime() < PASSWORD_RESET_COOLDOWN_MS
  ) {
    return;
  }

  const recipient: EmailRecipient = {
    id: userId,
    email: user.email,
    name: user.name,
  };

  const token = await withTransaction(async (client) => {
    await authRepository.deleteUnusedPasswordResetTokens(client, userId);
    return createPasswordResetToken(client, recipient);
  });

  void sendPasswordReset(recipient, token);
};

export const resetPassword = async (
  input: ResetPasswordInput,
): Promise<void> => {
  const tokenHash = hashPasswordResetToken(input.token);

  await withTransaction(async (client) => {
    const userId = await authRepository.consumePasswordResetToken(
      client,
      tokenHash,
    );

    if (!userId) {
      throw new InvalidPasswordResetTokenError();
    }

    const user = await usersRepository.findById(client, userId);
    if (!user) {
      throw new InvalidPasswordResetTokenError();
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    await usersRepository.updatePasswordHash(client, userId, passwordHash);
    await authRepository.deleteUnusedPasswordResetTokens(client, userId);
    await authRepository.revokeAllRefreshTokensByUser(client, userId);
  });
};

export const login = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase();
  const user = await usersRepository.findByEmail(pool, email);

  const passwordValid = user
    ? await bcrypt.compare(input.password, user.password_hash)
    : false;

  if (!user || !passwordValid) {
    throw new AuthenticationError('Credenciales inválidas', 'INVALID_CREDENTIALS');
  }

  if (!user.email_verified_at) {
    throw new EmailNotVerifiedError(
      'Tu cuenta aún no está verificada. Revisa tu correo o solicita un nuevo enlace.',
    );
  }

  const tokens = await issueTokenPair(pool, user.id as UserId, user.email);

  return { user: usersRepository.mapUserRow(user), ...tokens };
};

export const refresh = async (refreshToken: string) => {
  const record = await authRepository.findValidRefreshToken(
    pool,
    hashRefreshToken(refreshToken),
  );

  if (!record) {
    throw new AuthenticationError('Refresh token inválido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  if (!record.user.email_verified_at) {
    throw new EmailNotVerifiedError(
      'Tu cuenta aún no está verificada. Revisa tu correo o solicita un nuevo enlace.',
    );
  }

  try {
    const tokens = await withTransaction(async (client) => {
      const deleted = await authRepository.deleteRefreshTokenById(
        client,
        record.id,
      );

      if (!deleted) {
        throw new AuthenticationError(
          'Refresh token ya utilizado',
          'INVALID_REFRESH_TOKEN',
        );
      }

      return issueTokenPair(
        client,
        record.user.id as UserId,
        record.user.email,
      );
    });

    return {
      user: usersRepository.mapUserRow(record.user),
      ...tokens,
    };
  } catch (error: unknown) {
    const message = (error as Error).message;
    throw new AuthenticationError(`Error al renovar el refresh token: ${message}`, 'REFRESH_TOKEN_ERROR');
  }
};

export const logout = async (refreshToken: string | undefined): Promise<void> => {
  if (!refreshToken) return;
  await authRepository.revokeRefreshToken(pool, hashRefreshToken(refreshToken));
};

export const getMe = async (userId: UserId) => {
  const user = await usersRepository.findById(pool, userId);
  if (!user) throw new NotFoundError('Usuario no encontrado');
  return usersRepository.mapUserRow(user);
};

export const updateProfile = async (
  userId: UserId,
  input: UpdateProfileInput,
) => {
  if (
    input.avatarPublicId &&
    !input.avatarPublicId.startsWith(`meridia/avatars/${userId}/`)
  ) {
    throw new ValidationError(
      'El public_id del avatar no pertenece al usuario',
    );
  }

  const previous = await usersRepository.findById(pool, userId);
  if (!previous) throw new NotFoundError('Usuario no encontrado');

  const user = await usersRepository.updateProfile(pool, userId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
    ...(input.avatarPublicId !== undefined
      ? { avatarPublicId: input.avatarPublicId }
      : {}),
  });
  if (!user) throw new NotFoundError('Usuario no encontrado');

  if (
    previous.avatar_public_id &&
    previous.avatar_public_id !== user.avatar_public_id
  ) {
    await deleteCloudinaryAsset(previous.avatar_public_id);
  }

  return usersRepository.mapUserRow(user);
};
