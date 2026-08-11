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
