import { pool } from '../database/pool';

const TABLES = ['refresh_tokens', 'transactions', 'categories', 'accounts', 'users'];

export async function truncateAll(): Promise<void> {
  await pool.query(`TRUNCATE TABLE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`);
}
