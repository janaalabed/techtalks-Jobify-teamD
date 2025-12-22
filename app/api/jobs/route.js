// import { getAllJobs } from '@/db/queries/jobQueries';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//     try {
//         const { searchParams } = new URL(request.url);

//         const filters = {
//             search: searchParams.get('search') || undefined,
//             type: searchParams.get('type') || undefined,
//             location: searchParams.get('location') || undefined,
//         };

//         // Remove undefined values
//         Object.keys(filters).forEach(key =>
//             filters[key] === undefined && delete filters[key]
//         );

//         const jobs = await getAllJobs(filters);
//         return NextResponse.json(jobs);
//     } catch (error) {
//         console.error('Error fetching jobs:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch jobs' },
//             { status: 500 }
//         );
//     }
// }
import { NextResponse } from "next/server";
import getSupabase from "../../../lib/supabaseClient";

export async function GET(req) {
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const location = searchParams.get("location");
  const type = searchParams.get("type");
  const paid = searchParams.get("paid");
  const minSalary = searchParams.get("minSalary");

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (location) query = query.ilike("location", `%${location}%`);
  if (type) query = query.eq("type", type);
  if (paid !== null) query = query.eq("paid", paid === "true");
  if (minSalary) query = query.gte("salary", minSalary);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
