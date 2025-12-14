import { NextResponse } from "next/server";
import { getCompanyIdByUserId } from "@/db/queries/employerQueries";
import { updateApplicationStatus } from "@/db/queries/applicationQueries";
import { getServerUser } from "@/lib/auth";
 
export async function PATCH(req, { params }) {
  const user = await getServerUser();
  if (!user || user.role !== "company") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const companyId = await getCompanyIdByUserId(user.id);
  const appId = Number(params.appId);
  if (!companyId || !appId) return NextResponse.json({ error: "Bad request" }, { status: 400 });
 
  const body = await req.json();
  try {
    const ok = await updateApplicationStatus(companyId, appId, body.status);
    if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 400 });
  }
}