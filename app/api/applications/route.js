import { NextResponse } from "next/server";
import getSupabase from "../../../lib/supabaseClient";

export async function GET(req) {
  try {
    // Get applicant_id from query params
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get("applicantId");

    if (!applicantId) {
      return NextResponse.json({ error: "Applicant ID is required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("applications")
      .select("id, job_id, cv_url, cover_letter, status, applied_at, jobs(title, location, type, salary)")
      .eq("applicant_id", applicantId)
      .order("applied_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
