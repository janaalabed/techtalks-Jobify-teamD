import { query } from "../connection";

export async function createJob(companyId, data) {
  const title = (data.title || "").trim();
  const description = (data.description || "").trim();
  if (!title || !description) throw new Error("Title and description are required");

  await query(
    `INSERT INTO jobs
      (company_id, title, description, requirements, salary_min, salary_max, job_type, contract_type, is_paid, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      companyId,
      title,
      description,
      data.requirements || null,
      data.salary_min ?? null,
      data.salary_max ?? null,
      data.job_type || "onsite",
      data.contract_type || "full_time",
      data.is_paid ? 1 : 0,
      data.status || "open",
    ]
  );
}

export async function listCompanyJobs(companyId) {
  return await query(
    `SELECT id, title, job_type, contract_type, is_paid, status, created_at
     FROM jobs
     WHERE company_id=$1
     ORDER BY created_at DESC`,
    [companyId]
  );
}

export async function getCompanyJob(companyId, jobId) {
  const rows = await query(
    `SELECT * FROM jobs WHERE id=$1 AND company_id=$2 LIMIT 1`,
    [jobId, companyId]
  );
  return rows[0] || null;
}

export async function updateCompanyJob(companyId, jobId, data) {
  const title = (data.title || "").trim();
  const description = (data.description || "").trim();
  if (!title || !description) throw new Error("Title and description are required");

  await query(
    `UPDATE jobs
     SET title=$1, description=$2, requirements=$3, salary_min=$4, salary_max=$5, job_type=$6, contract_type=$7, is_paid=$8, status=$9
     WHERE id=$10 AND company_id=$11`,
    [
      title,
      description,
      data.requirements || null,
      data.salary_min ?? null,
      data.salary_max ?? null,
      data.job_type || "onsite",
      data.contract_type || "full_time",
      data.is_paid ? 1 : 0,
      data.status || "open",
      jobId,
      companyId,
    ]
  );
}

export async function deleteCompanyJob(companyId, jobId) {
  await query(`DELETE FROM jobs WHERE id=$1 AND company_id=$2`, [jobId, companyId]);
}

export async function getAllJobs(filters = {}) {
  let sql = `
    SELECT j.*, c.name as company_name, c.logo_url, c.location as company_location
    FROM jobs j
    JOIN companies c ON j.company_id = c.user_id
    WHERE j.status = 'open'
  `;
  const params = [];
  let paramIndex = 1;

  if (filters.type) {
    sql += ` AND j.job_type = $${paramIndex++}`;
    params.push(filters.type);
  }

  if (filters.search) {
    sql += ` AND (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
    const term = `%${filters.search}%`;
    params.push(term);
    paramIndex++;
  }

  if (filters.location) {
    sql += ` AND (c.location ILIKE $${paramIndex++})`;
    params.push(`%${filters.location}%`);
  }

  sql += ` ORDER BY j.created_at DESC`;

  return await query(sql, params);
}

export async function getJobById(id) {
  const rows = await query(
    `SELECT j.*, c.name as company_name, c.logo_url, c.location as company_location, c.website as company_website, c.description as company_description
     FROM jobs j
     JOIN companies c ON j.company_id = c.user_id
     WHERE j.id = $1`,
    [id]
  );

  if (!rows.length) return null;

  const job = rows[0];
  return {
    ...job,
    type: job.job_type,
    location: job.company_location
  };
}