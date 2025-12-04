// PostgreSQL connection using pg (Supabase)
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Supabase
});

export default {
  query: (text, params) => pool.query(text, params),
  pool
};
