import '../config/loadEnv';

const base = process.env.DATABASE_URL;
if (!base) {
  throw new Error('DATABASE_URL no configurada para los tests (revisa .env)');
}

const url = new URL(base);
url.pathname = '/meridia_test';

process.env.DATABASE_URL = url.toString();
process.env.NODE_ENV = 'test';
process.env.PG_SSL = 'false';
process.env.RATE_LIMIT_MAX = '1000';
process.env.COOKIE_DOMAIN = '127.0.0.1';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';
process.env.WEB_APP_URL = 'http://localhost:5173';
process.env.SMTP_HOST = '';
process.env.SMTP_FROM = '';
process.env.FEEDBACK_TO_EMAIL = 'feedback@test.com';
process.env.FEEDBACK_RATE_LIMIT_MAX = '1000';
process.env.REGISTER_RATE_LIMIT_MAX = '1000';
process.env.RESEND_VERIFICATION_RATE_LIMIT_MAX = '1000';
process.env.VERIFICATION_RESEND_COOLDOWN_SECONDS = '60';
process.env.PASSWORD_RESET_TTL_MINUTES = '60';
process.env.PASSWORD_RESET_COOLDOWN_SECONDS = '60';
process.env.FORGOT_PASSWORD_RATE_LIMIT_MAX = '1000';
