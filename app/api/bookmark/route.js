import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { toggleBookmark, getBookmarks } from "@/db/queries/bookmarkQueries";

export async function GET(request) {
    const user = getServerUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const bookmarks = await getBookmarks(user.id);
        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    const user = getServerUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { job_id } = await request.json();
        if (!job_id) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        const result = await toggleBookmark(user.id, job_id);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
