import type { Express } from "express";
import request from "supertest";

export const VALID_PASSWORD = "Password123!";

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
