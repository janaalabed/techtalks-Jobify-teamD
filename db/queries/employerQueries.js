import { query } from "@/db/connection";

export async function getCompanyByUserId(userId) {
  const rows = await query(
    `SELECT user_id, name, industry, logo_url, description, website, location
     FROM companies
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );

  return rows.length ? rows[0] : null;
}

export async function upsertCompanyByUserId(userId, payload) {
  const name = (payload.name || "").trim();
  if (!name) throw new Error("Company name is required");

  const industry = payload.industry || null;
  const logo_url = payload.logo_url || null;
  const description = payload.description || null;
  const website = payload.website || null;
  const location = payload.location || null;

  // Does company exist?
  const existing = await query(
    `SELECT id FROM companies WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  if (existing.length) {
    await query(
      `UPDATE companies
       SET name = $1, industry = $2, logo_url = $3, description = $4, website = $5, location = $6
       WHERE user_id = $7`,
      [name, industry, logo_url, description, website, location, userId]
    );
    return { updated: true };
  }

  await query(
    `INSERT INTO companies (user_id, name, industry, logo_url, description, website, location)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, name, industry, logo_url, description, website, location]
  );

  return { created: true };
}