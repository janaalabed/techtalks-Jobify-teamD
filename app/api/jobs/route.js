import { NextResponse } from 'next/server';
import { getAllJobs } from '@/db/queries/jobQueries';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            type: searchParams.get('type'),
            skills: searchParams.get('skills') ? searchParams.get('skills').split(',') : [],
            minSalary: searchParams.get('minSalary'),
            maxSalary: searchParams.get('maxSalary'),
            location: searchParams.get('location'),
            search: searchParams.get('search'),
            sort: searchParams.get('sort')
        };

        // Remove undefined/null/empty values
        Object.keys(filters).forEach(key => {
            if (filters[key] === null || filters[key] === '' || (Array.isArray(filters[key]) && filters[key].length === 0)) {
                delete filters[key];
            }
        });

        const jobs = await getAllJobs(filters);
        return NextResponse.json({ status: 'success', data: jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}
