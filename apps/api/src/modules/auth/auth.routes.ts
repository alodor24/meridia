import { Router } from 'express';
import { authRateLimit } from '../../middlewares/rateLimit';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { loginSchema, registerSchema, updateProfileSchema } from './auth.schemas';
import * as authController from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validate(registerSchema), authController.register);
authRouter.post('/login', authRateLimit, validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.me);
authRouter.patch('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);
