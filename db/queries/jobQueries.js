import { query } from "../connection";
 
export async function createJob(companyId, data) {
  const title = (data.title || "").trim();
  const description = (data.description || "").trim();
  if (!title || !description) throw new Error("Title and description are required");
 
  await query(
    `INSERT INTO jobs
      (company_id, title, description, requirements, salary_min, salary_max, job_type, contract_type, is_paid, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
     WHERE company_id=?
     ORDER BY created_at DESC`,
    [companyId]
  );
}
 
export async function getCompanyJob(companyId, jobId) {
  const rows = await query(
    `SELECT * FROM jobs WHERE id=? AND company_id=? LIMIT 1`,
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
     SET title=?, description=?, requirements=?, salary_min=?, salary_max=?, job_type=?, contract_type=?, is_paid=?, status=?
     WHERE id=? AND company_id=?`,
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
  await query(`DELETE FROM jobs WHERE id=? AND company_id=?`, [jobId, companyId]);
}
 