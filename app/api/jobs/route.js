import { getAllJobs } from '@/db/queries/jobQueries';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            search: searchParams.get('search') || undefined,
            type: searchParams.get('type') || undefined,
            location: searchParams.get('location') || undefined,
        };

        // Remove undefined values
        Object.keys(filters).forEach(key =>
            filters[key] === undefined && delete filters[key]
        );

        const jobs = await getAllJobs(filters);
        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}
