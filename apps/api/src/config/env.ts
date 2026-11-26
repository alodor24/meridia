import "./loadEnv";
import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .transform((v) => v === "true");

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL es requerido"),
    PG_SSL: booleanFromString.default(false),
    JWT_ACCESS_SECRET: z
      .string()
      .min(16, "JWT_ACCESS_SECRET debe tener al menos 16 caracteres"),
    JWT_REFRESH_SECRET: z
      .string()
      .min(16, "JWT_REFRESH_SECRET debe tener al menos 16 caracteres"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    COOKIE_SECURE: booleanFromString.default(false),
    COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
    COOKIE_NAME: z.string().default("meridia_refresh"),
    COOKIE_DOMAIN: z.string().trim().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().trim().optional(),
    CLOUDINARY_API_KEY: z.string().trim().optional(),
    CLOUDINARY_API_SECRET: z.string().trim().optional(),
    WEB_APP_URL: z.string().url().default("http://localhost:5173"),
    SMTP_HOST: z.string().trim().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_SECURE: booleanFromString.default(false),
    SMTP_USER: z.string().trim().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().trim().optional(),
    FEEDBACK_TO_EMAIL: z
      .string()
      .trim()
      .email("Email de feedback inválido")
      .optional(),
    FEEDBACK_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
    EMAIL_VERIFICATION_TTL_HOURS: z.coerce
      .number()
      .int()
      .positive()
      .default(24),
    VERIFICATION_RESEND_COOLDOWN_SECONDS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(60),
    PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().positive().default(60),
    PASSWORD_RESET_COOLDOWN_SECONDS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(60),
    REGISTER_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
    RESEND_VERIFICATION_RATE_LIMIT_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(3),
    FORGOT_PASSWORD_RATE_LIMIT_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(5),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== "production") return;

    if (!data.SMTP_HOST) {
      ctx.addIssue({
        code: "custom",
        path: ["SMTP_HOST"],
        message: "SMTP_HOST es requerido en producción",
      });
    }
    if (!data.SMTP_FROM) {
      ctx.addIssue({
        code: "custom",
        path: ["SMTP_FROM"],
        message: "SMTP_FROM es requerido en producción",
      });
    }
    if (!data.FEEDBACK_TO_EMAIL) {
      ctx.addIssue({
        code: "custom",
        path: ["FEEDBACK_TO_EMAIL"],
        message: "FEEDBACK_TO_EMAIL es requerido en producción",
      });
    }
    if (data.COOKIE_SAME_SITE === "none" && !data.COOKIE_SECURE) {
      ctx.addIssue({
        code: "custom",
        path: ["COOKIE_SAME_SITE"],
        message: "COOKIE_SAME_SITE=none requiere COOKIE_SECURE=true",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.flatten().fieldErrors;
  console.error("✗ Variables de entorno inválidas:");
  for (const [key, messages] of Object.entries(details)) {
    console.error(`  - ${key}: ${messages?.join(", ")}`);
  }
  process.exit(1);
}

export const env = parsed.data;

export const isProd = env.NODE_ENV === "production";
