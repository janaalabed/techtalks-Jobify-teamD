import { NextResponse } from "next/server";
import getSupabase from "../../../lib/supabaseClient";

export async function GET() {
  try {
    const supabase = getSupabase();

    // ultra-light query → only checks DB responsiveness
    const { error } = await supabase
      .from("profiles") // change if you use another table
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { status: "error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    // happens when DB is paused or waking
    return NextResponse.json(
      { status: "starting" },
      { status: 503 }
    );
  }
}
