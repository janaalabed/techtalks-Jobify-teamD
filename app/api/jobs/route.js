import { NextResponse } from 'next/server';
import { getAllJobs } from '@/db/queries/jobQueries';

export async function GET() {
    try {
        const jobs = await getAllJobs();
        return NextResponse.json({ status: 'success', data: jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}
