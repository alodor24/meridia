import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/env";
import { sendNoContent, sendSuccess } from "../../shared/http/http";
import { expiresInToMs } from "../../shared/utils/time";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { isAppError } from "../../shared/errors";
import * as authService from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 201);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body);
  sendSuccess(res, result);
});

export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resendVerification(req.body);
    sendSuccess(res, { message: authService.GENERIC_RESEND_MESSAGE });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body);
    sendSuccess(res, { message: authService.GENERIC_FORGOT_PASSWORD_MESSAGE });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    clearRefreshCookie(res);
    sendSuccess(res, { reset: true });
  },
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { user, accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  try {
    const token = readRefreshCookie(req);
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.accessToken });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Error interno del servidor",
        },
      });
    }
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(readRefreshCookie(req));
  clearRefreshCookie(res);
  sendNoContent(res);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, { user });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, { user });
  },
);

const readRefreshCookie = (req: Request): string =>
  (req.cookies as Record<string, string> | undefined)?.[env.COOKIE_NAME] ?? "";

const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  path: "/",
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(env.COOKIE_NAME, token, {
    ...refreshCookieOptions(),
    maxAge: expiresInToMs(env.JWT_REFRESH_EXPIRES_IN),
  });
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(env.COOKIE_NAME, refreshCookieOptions());
};
