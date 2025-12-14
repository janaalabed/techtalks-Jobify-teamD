import { getPool } from "@/db/connection";
 
export async function getCompanyByUserId(userId) {
  const pool = getPool();
 
  const [rows] = await pool.query(
    `SELECT user_id, name, industry, logo_url, description, website, location
     FROM companies
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );
 
  return rows.length ? rows[0] : null;
}
 
export async function upsertCompanyByUserId(userId, payload) {
  const pool = getPool();
 
  const name = (payload.name || "").trim();
  if (!name) throw new Error("Company name is required");
 
  const industry = payload.industry || null;
  const logo_url = payload.logo_url || null;
  const description = payload.description || null;
  const website = payload.website || null;
  const location = payload.location || null;
 
  // Does company exist?
  const [existing] = await pool.query(
    `SELECT id FROM companies WHERE user_id = ? LIMIT 1`,
    [userId]
  );
 
  if (existing.length) {
    await pool.query(
      `UPDATE companies
       SET name = ?, industry = ?, logo_url = ?, description = ?, website = ?, location = ?
       WHERE user_id = ?`,
      [name, industry, logo_url, description, website, location, userId]
    );
    return { updated: true };
  }
 
  await pool.query(
    `INSERT INTO companies (user_id, name, industry, logo_url, description, website, location)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, industry, logo_url, description, website, location]
  );
 
  return { created: true };
}
 