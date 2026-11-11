import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const rateLimitMessage = {
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
  },
};

export const authRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.REGISTER_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const resendVerificationRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RESEND_VERIFICATION_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const forgotPasswordRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.FORGOT_PASSWORD_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const feedbackRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.FEEDBACK_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});
