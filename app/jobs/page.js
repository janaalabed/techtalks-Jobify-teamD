'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
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

function JobsContent() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null); // Clear previous errors
            try {
                // Construct query string from searchParams
                const params = new URLSearchParams();
                searchParams.forEach((value, key) => {
                    params.append(key, value);
                });

                const response = await fetch(`/api/jobs?${params.toString()}`, { signal });
                const data = await response.json();

                if (data.status === 'success') {
                    // Enhance jobs with mock data for MVP demonstration if fields are missing
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
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError('Failed to fetch jobs');
                    console.error(err);
                }
            } finally {
                // Only turn off loading if not aborted (prevents race conditions in UI state)
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchJobs();

        return () => {
            controller.abort();
        };
    }, [searchParams]);

    const searchTerm = searchParams.get('search');
    const showNoResults = !isLoading && jobs.length === 0 && searchTerm;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Job Listings</h1>

                <JobFilters />

                {isLoading && jobs.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <div className="text-red-600 text-xl">{error}</div>
                    </div>
                ) : (
                    <>
                        {/* Show loading overlay if refreshing existing results */}
                        {isLoading && jobs.length > 0 && (
                            <div className="fixed top-4 right-4 z-50">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {showNoResults ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 text-lg">No jobs found matching your search.</p>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <JobsContent />
        </Suspense>
    );
}
