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

export async function mysqlQuery(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export const query = pgQuery;