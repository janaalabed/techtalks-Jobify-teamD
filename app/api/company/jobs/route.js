import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

const MOCK_USER_ID = "company-user-1";

export async function GET() {
    try {
        const { data, error } = await supabaseServer.from("jobs").select("*").eq("comapny_user_1", MOCK_USER_ID).order("create_at", { ascending: false });
        if (error) {
            console.error("SuperBase Get jobs error:", error);
            return NextResponse.json({ error: "server error" }, { status: 500 });
        }
        return NextResponse.json(data || []);
    } catch (err) {
        console.error("Get /api/company/jobs");
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const payload = {
            company_user_id: MOCK_USER_ID,
            title: body.title,
            description: body.description,
            requirements: body.requirements || null,
            job_type: body.jobType,
            role_type: body.roleType,
            paid_status: body.paidStatus,
            salary: body.salary || null,
            location: body.location,
            is_filled: false,
        };
        if (!payload.title || !payload.description || !payload.location) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const { error } = await supabaseServer.from("jobs").insert([payload]);
        if (error) {
            console.error("Supabase Post job error: ", error);
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Post /api/company/jobs", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
