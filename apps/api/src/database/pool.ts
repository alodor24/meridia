import type { Pool as PoolType } from 'pg';
import pg from 'pg';
import { env } from '../config/env';
import { logger } from '../shared/logger';

const { Pool } = pg;

// DATE (OID 1082) se devuelve como texto "YYYY-MM-DD" (no como Date).
pg.types.setTypeParser(1082, (value: string) => value);

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.PG_SSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Error inesperado en el pool de PostgreSQL');
});

export type Queryable = Pick<PoolType, 'query'>;

export const withTransaction = async <T>(
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};