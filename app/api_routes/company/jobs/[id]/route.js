import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { requireCompany } from "@/lib/auth";
 
async function getCompanyId(userId) {
  const rows = await q(`SELECT id FROM companies WHERE user_id=? LIMIT 1`, [userId]);
  return rows[0]?.id || null;
}
 
async function ownsJob(companyId, jobId) {
  const rows = await q(`SELECT id FROM jobs WHERE id=? AND company_id=? LIMIT 1`, [jobId, companyId]);
  return !!rows.length;
}
 
export async function PUT(req, { params }) {
  const gate = requireCompany();
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
 
  const companyId = await getCompanyId(gate.auth.userId);
  const jobId = Number(params.id);
  if (!companyId || !jobId) return NextResponse.json({ error: "Bad request" }, { status: 400 });
 
  if (!(await ownsJob(companyId, jobId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  const b = await req.json();
  await q(
    `UPDATE jobs
     SET title=?, description=?, requirements=?, salary_min=?, salary_max=?, job_type=?, contract_type=?, is_paid=?, status=?
     WHERE id=? AND company_id=?`,
    [
      (b.title || "").trim(),
      (b.description || "").trim(),
      b.requirements || null,
      b.salary_min || null,
      b.salary_max || null,
      b.job_type || "onsite",
      b.contract_type || "full_time",
      b.is_paid ? 1 : 0,
      b.status || "open",
      jobId,
      companyId,
    ]
  );
 
  return NextResponse.json({ ok: true });
}
 
export async function DELETE(req, { params }) {
  const gate = requireCompany();
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
 
  const companyId = await getCompanyId(gate.auth.userId);
  const jobId = Number(params.id);
  if (!companyId || !jobId) return NextResponse.json({ error: "Bad request" }, { status: 400 });
 
  if (!(await ownsJob(companyId, jobId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  await q(`DELETE FROM jobs WHERE id=? AND company_id=?`, [jobId, companyId]);
  return NextResponse.json({ ok: true });
}
 