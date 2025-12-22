import { NextResponse } from "next/server";
import getSupabase from "../../../lib/supabaseClient";

export async function POST(req) {
  const supabase = getSupabase();
  const { jobId } = await req.json();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  // Toggle bookmark
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .single();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    return NextResponse.json({ bookmarked: false });
  }

  await supabase.from("bookmarks").insert({
    user_id: userId,
    job_id: jobId,
  });

  return NextResponse.json({ bookmarked: true });
}
