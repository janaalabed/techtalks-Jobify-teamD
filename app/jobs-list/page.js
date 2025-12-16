"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';

export default function JobsListPage() {
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [bookmarkedJobIds, setBookmarkedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
        fetchBookmarks();
    }, [searchParams]);

    const fetchBookmarks = async () => {
        try {
            const res = await fetch('/api/bookmark');
            if (res.ok) {
                const bookmarks = await res.json();
                const ids = new Set(bookmarks.map(b => b.id));
                setBookmarkedJobIds(ids);
            }
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const queryString = searchParams.toString();
            const url = queryString ? `/api/jobs?${queryString}` : '/api/jobs';

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch jobs');

            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading jobs...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
                    <p className="mt-2 text-gray-600">Browse through available job listings</p>
                </div>

                <JobFilters />

                {jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-2 text-gray-600">
                            {searchParams.toString()
                                ? "Try adjusting your filters to see more results"
                                : "There are no job listings available at the moment"}
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    initialBookmarked={bookmarkedJobIds.has(job.id)}
                                    onToggleBookmark={(bookmarked) => {
                                        setBookmarkedJobIds(prev => {
                                            const newSet = new Set(prev);
                                            if (bookmarked) {
                                                newSet.add(job.id);
                                            } else {
                                                newSet.delete(job.id);
                                            }
                                            return newSet;
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
