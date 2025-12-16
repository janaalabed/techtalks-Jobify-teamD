import pkg from "pg";
const { Pool: PgPool } = pkg;

// Use DATABASE_URL directly from environment
const connectionString = process.env.DATABASE_URL || '';

console.log("DEBUG: Using DB URL length:", connectionString.length);

const pgPool = new PgPool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

// Test connection on startup
pgPool.connect()
  .then(client => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

export const pg = {
  query: (text, params) => pgPool.query(text, params),
  pool: pgPool
};

// Helper to match the mysql2 execute signature (sql, params) -> rows
// pg query returns { rows: [], ... }
export async function pgQuery(sql, params = []) {
  try {
    const result = await pg.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error("❌ Database query failed:", error.message);
    throw error;
  }
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