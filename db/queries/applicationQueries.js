// db/queries/applicationQueries.js
import { query } from "../connection";
 
export async function listApplicationsForJob(companyId, jobId) {
  // Ensures job belongs to this company
  const job = await query(
    `SELECT id, title FROM jobs WHERE id=? AND company_id=? LIMIT 1`,
    [jobId, companyId]
  );
  if (!job.length) return { job: null, applicants: null };
 
  const applicants = await query(
    `SELECT
       a.id AS application_id,
       a.status,
       a.cv_url,
       a.cover_letter,
       a.created_at,
       u.id AS applicant_user_id,
       u.full_name,
       u.email
     FROM applications a
     JOIN users u ON u.id = a.applicant_user_id
     WHERE a.job_id=?
     ORDER BY a.created_at DESC`,
    [jobId]
  );
 
  return { job: job[0], applicants };
}
 
export async function updateApplicationStatus(companyId, appId, status) {
  if (!["reviewed", "accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }
 
  // Ensure application belongs to a job owned by this company
  const owned = await query(
    `SELECT a.id
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id=? AND j.company_id=?
     LIMIT 1`,
    [appId, companyId]
  );
  if (!owned.length) return false;
 
  await query(`UPDATE applications SET status=? WHERE id=?`, [status, appId]);
  return true;
}
 