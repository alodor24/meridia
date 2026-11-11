import type { Express } from "express";
import request from "supertest";
import {
  getLastPasswordResetEmail,
  getLastVerificationEmail,
} from "../shared/email/mailer";

export const VALID_PASSWORD = "Meridia2026!Segura";

export interface RegisterOverrides {
  name?: string;
  email?: string;
  password?: string;
  country?: string;
  currency?: string;
}

export const registerPayload = (
  overrides: RegisterOverrides = {},
): Record<string, unknown> => {
  return {
    name: "Test User",
    email: `user_${Date.now()}_${Math.floor(Math.random() * 1e6)}@test.com`,
    password: VALID_PASSWORD,
    country: "AR",
    currency: "ARS",
    ...overrides,
  };
};

export const register = async (
  app: Express,
  overrides: RegisterOverrides = {},
): Promise<request.Response> =>
  request(app).post("/api/auth/register").send(registerPayload(overrides));

export const getVerificationToken = (email: string): string => {
  const sent = getLastVerificationEmail(email);
  if (!sent) {
    throw new Error(`No se envió email de verificación a ${email}`);
  }

  const token = new URL(sent.url).searchParams.get("token");
  if (!token) {
    throw new Error(`El email de verificación para ${email} no tiene token`);
  }

  return token;
};

export const getPasswordResetToken = (email: string): string => {
  const sent = getLastPasswordResetEmail(email);
  if (!sent) {
    throw new Error(`No se envió email de restablecimiento a ${email}`);
  }

  const token = new URL(sent.url).searchParams.get("token");
  if (!token) {
    throw new Error(`El email de restablecimiento para ${email} no tiene token`);
  }

  return token;
};

export const verifyEmail = async (
  app: Express,
  email: string,
): Promise<request.Response> => {
  const token = getVerificationToken(email);
  return request(app).post("/api/auth/verify-email").send({ token });
};

export const registerAndLogin = async (
  app: Express,
  overrides: RegisterOverrides = {},
): Promise<{
  agent: ReturnType<typeof request.agent>;
  email: string;
  accessToken: string;
}> => {
  const payload = registerPayload(overrides);
  const registerResponse = await request(app)
    .post("/api/auth/register")
    .send(payload);
  if (registerResponse.status !== 201) {
    throw new Error(`register falló: ${JSON.stringify(registerResponse.body)}`);
  }

  const verificationResponse = await verifyEmail(app, payload.email as string);
  if (verificationResponse.status !== 200) {
    throw new Error(
      `verificación falló: ${JSON.stringify(verificationResponse.body)}`,
    );
  }

  const agent = request.agent(app);
  const loginResponse = await agent
    .post("/api/auth/login")
    .send({ email: payload.email, password: payload.password });
  if (loginResponse.status !== 200) {
    throw new Error(`login falló: ${JSON.stringify(loginResponse.body)}`);
  }

  const accessToken = loginResponse.body.data.accessToken as string;
  agent.set("Authorization", `Bearer ${accessToken}`);

  return {
    agent,
    email: payload.email as string,
    accessToken,
  };
};
