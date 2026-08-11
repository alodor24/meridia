/**
 * Runner de migraciones SQL (sin dependencias).
 * Aplica las migraciones de database/migrations en orden alfabético,
 * registrando cada una en la tabla schema_migrations dentro de una transacción.
 *
 * Uso:
 *   node database/migrate.mjs up     # aplica pendientes
 *   node database/migrate.mjs down   # desmarca la última aplicada (no revierte SQL)
 *   node database/migrate.mjs status # lista migraciones y su estado
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MIGRATIONS_DIR = join(__dirname, 'migrations');

loadDotEnv(join(ROOT, '.env'));

const command = process.argv[2] ?? 'status';

function loadDotEnv(file) {
  try {
    const content = readFileSync(file, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* sin .env es válido (p.ej. envs inyectados) */
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Falta DATABASE_URL (revisa .env / .env.example).');
    process.exit(1);
  }

  const ssl = /sslmode=require|sslmode=verify-full/i.test(databaseUrl) || process.env.PG_SSL === 'true';
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });
  await client.connect();

  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

    const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
    const { rows } = await client.query('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.name));

    if (command === 'status') {
      for (const file of files) {
        console.log(`${applied.has(file) ? '[aplicada]' : '[pendiente]'} ${file}`);
      }
      return;
    }

    if (command === 'up') {
      for (const file of files) {
        if (applied.has(file)) continue;
        const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
        try {
          await client.query('BEGIN');
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✓ ${file}`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`✗ falló ${file}: ${err.message}`);
          process.exit(1);
        }
      }
      console.log('Migraciones aplicadas.');
      return;
    }

    if (command === 'down') {
      const last = (await client.query(
        'SELECT name FROM schema_migrations ORDER BY applied_at DESC LIMIT 1',
      )).rows[0];
      if (!last) {
        console.log('No hay migraciones aplicadas que desmarcar.');
        return;
      }
      await client.query('DELETE FROM schema_migrations WHERE name = $1', [last.name]);
      console.log(`~ desmarcada ${last.name} (el SQL no se revierte automáticamente).`);
      return;
    }

    console.error(`Comando desconocido: ${command}`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
