import { pool } from "../database/pool";

const TABLES = [
  "refresh_tokens",
  "transactions",
  "categories",
  "accounts",
  "users",
];

export const truncateAll = async (): Promise<void> => {
  await pool.query(
    `TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`,
  );
};
