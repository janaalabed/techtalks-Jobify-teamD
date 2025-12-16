import pkg from "pg";
const { Pool: PgPool } = pkg;

// Patch hostname if needed (system fails to resolve db. subdomain)
const connectionString = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace('db.cjnbcpbzumrsfcsmflvk.supabase.co', 'cjnbcpbzumrsfcsmflvk.supabase.co')
  : '';

const pgPool = new PgPool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const pg = {
  query: (text, params) => pgPool.query(text, params),
  pool: pgPool
};

// Helper to match the mysql2 execute signature (sql, params) -> rows
// pg query returns { rows: [], ... }
export async function pgQuery(sql, params = []) {
  const result = await pg.query(sql, params);
  return result.rows;
}

import mysql from "mysql2/promise";

let Pool;

export function getPool() {
  if (!Pool) {
    Pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return Pool;
}

export async function mysqlQuery(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export const query = pgQuery;