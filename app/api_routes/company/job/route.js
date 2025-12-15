import { NextResponse } from "next/server";
import { getCompanyIdByUserId } from "@/db/queries/employerQueries";
import { createJob, listCompanyJobs } from "@/db/queries/jobQueries";
import { getServerUser } from "@/lib/auth";
 
export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== "company") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const companyId = await getCompanyIdByUserId(user.id);
  if (!companyId) return NextResponse.json({ error: "Create company profile first" }, { status: 400 });
 
  const jobs = await listCompanyJobs(companyId);
  return NextResponse.json({ jobs });
}
 
export async function POST(req) {
  const user = await getServerUser();
  if (!user || user.role !== "company") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const companyId = await getCompanyIdByUserId(user.id);
  if (!companyId) return NextResponse.json({ error: "Create company profile first" }, { status: 400 });
 
  const body = await req.json();
  try {
    await createJob(companyId, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 400 });
  }
}
 