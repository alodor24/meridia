/**
 * Crea la base de datos local si no existe (para desarrollo).
 * Usa el rol actual vía socket de PostgreSQL.
 * Uso: node database/db-create.mjs [nombre]
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

try {
  const env = readFileSync(join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {
  /* sin .env */
}

const dbName = process.argv[2] ?? process.env.PGDATABASE ?? 'meridia_db';
const exists = execSync(`psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`, {
  stdio: ['ignore', 'pipe', 'ignore'],
}).toString().trim();

if (exists === '1') {
  console.log(`La base de datos "${dbName}" ya existe.`);
} else {
  execSync(`createdb "${dbName}"`, { stdio: 'inherit' });
  console.log(`Base de datos "${dbName}" creada.`);
}
