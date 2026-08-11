import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import '../config/loadEnv';

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(here, '..', '..', '..', '..', 'database', 'migrations');
const TEST_DB_NAME = 'meridia_test';

function testUrl(): string {
  const base = process.env.DATABASE_URL;
  if (!base) throw new Error('DATABASE_URL no configurada');
  const url = new URL(base);
  url.pathname = `/${TEST_DB_NAME}`;
  return url.toString();
}

async function ensureDatabase(): Promise<void> {
  const base = process.env.DATABASE_URL!;
  const client = new pg.Client({ connectionString: base, ssl: false });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE ${TEST_DB_NAME}`);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code !== '42P04') throw error;
  } finally {
    await client.end();
  }
}

async function runMigrations(url: string): Promise<void> {
  const client = new pg.Client({ connectionString: url, ssl: false });
  await client.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

    const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
    const { rows } = await client.query<{ name: string }>('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.name));

    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}

export default async function globalSetup(): Promise<void> {
  await ensureDatabase();
  await runMigrations(testUrl());
}
