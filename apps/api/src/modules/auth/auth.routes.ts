import { Router } from 'express';
import {
  authRateLimit,
  forgotPasswordRateLimit,
  registerRateLimit,
  resendVerificationRateLimit,
} from '../../middlewares/rateLimit';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from './auth.schemas';
import * as authController from './auth.controller';

export const authRouter = Router();

authRouter.post(
  '/register',
  registerRateLimit,
  authRateLimit,
  validate(registerSchema),
  authController.register,
);
authRouter.post('/login', authRateLimit, validate(loginSchema), authController.login);
authRouter.post(
  '/verify-email',
  authRateLimit,
  validate(verifyEmailSchema),
  authController.verifyEmail,
);
authRouter.post(
  '/resend-verification',
  resendVerificationRateLimit,
  validate(resendVerificationSchema),
  authController.resendVerification,
);
authRouter.post(
  '/forgot-password',
  forgotPasswordRateLimit,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
authRouter.post(
  '/reset-password',
  authRateLimit,
  validate(resetPasswordSchema),
  authController.resetPassword,
);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.me);
authRouter.patch('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);
