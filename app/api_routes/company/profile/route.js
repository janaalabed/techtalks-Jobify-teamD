import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { getCompanyByUserId, upsertCompanyByUserId } from "@/db/queries/employerQueries";
 
export async function GET() {
  const user = getServerUser();
 
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "company") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 
  try {
    const company = await getCompanyByUserId(user.id);
    return NextResponse.json({ company });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
 
export async function POST(req) {
  const user = getServerUser();
 
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "company") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 
  try {
    const body = await req.json();
    await upsertCompanyByUserId(user.id, body);
    const company = await getCompanyByUserId(user.id);
    return NextResponse.json({ ok: true, company });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Bad request" }, { status: 400 });
  }
}
 