'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';

// Mock data helpers
const MOCK_SKILLS = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'TypeScript', 'AWS', 'Docker'];
const getRandomSkills = () => {
    const shuffled = [...MOCK_SKILLS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 1);
};
const getRandomSalary = () => {
    const min = Math.floor(Math.random() * 50) + 30; // 30k - 80k
    const max = min + Math.floor(Math.random() * 50) + 10; // +10k - 60k
    return { min: min * 1000, max: max * 1000 };
};

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                // Construct query string from searchParams
                const params = new URLSearchParams();
                searchParams.forEach((value, key) => {
                    params.append(key, value);
                });

                const response = await fetch(`/api/jobs?${params.toString()}`);
                const data = await response.json();

                if (data.status === 'success') {
                    // Enhance jobs with mock data for MVP demonstration if fields are missing
                    // Note: In a real scenario, we wouldn't overwrite backend data if we trusted the filter.
                    // But to keep the UI looking populated for the MVP if the DB is sparse:
                    const enhancedJobs = data.data.map(job => ({
                        ...job,
                        skills: job.skills || getRandomSkills(),
                        salary_min: job.salary_min || getRandomSalary().min,
                        salary_max: job.salary_max || getRandomSalary().max,
                        type: job.type || (Math.random() > 0.5 ? 'Full-time' : 'Contract')
                    }));
                    setJobs(enhancedJobs);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch jobs');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Job Listings</h1>

                <JobFilters />

                {jobs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
