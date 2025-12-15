import pkg from "pg";
const { Pool: PgPool } = pkg;

const pgPool = new PgPool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

 export const pg = {
  query: (text, params) => pgPool.query(text, params),
  pool: pgPool
};


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
  const [rows] = await getMySQLPool().execute(sql, params);
  return rows;
}