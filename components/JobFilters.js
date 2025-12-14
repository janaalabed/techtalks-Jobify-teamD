'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'TypeScript', 'AWS', 'Docker'];

export default function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const updateFilters = useCallback((updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','));
            } else {
                params.set(key, value);
            }
        });

        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    // Debounce search update
    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        const timer = setTimeout(() => {
            if (searchTerm !== currentSearch) {
                updateFilters({ search: searchTerm });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, searchParams, updateFilters]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeChange = (e) => {
        updateFilters({ type: e.target.value });
    };

    const handleSkillToggle = (skill) => {
        const currentSkills = searchParams.get('skills') ? searchParams.get('skills').split(',') : [];
        const newSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];
        updateFilters({ skills: newSkills });
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        updateFilters({ [name]: value });
    };

    const handleLocationChange = (e) => {
        updateFilters({ location: e.target.value });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.push('?');
    };

    // Derived state for UI
    const currentType = searchParams.get('type') || '';
    const currentSkills = searchParams.get('skills') ? searchParams.get('skills').split(',') : [];
    const currentMinSalary = searchParams.get('minSalary') || '';
    const currentMaxSalary = searchParams.get('maxSalary') || '';
    const currentLocation = searchParams.get('location') || '';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Clear Filters
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Keywords</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by title, company, or keywords..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Job Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                        value={currentType}
                        onChange={handleTypeChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="">All Types</option>
                        {JOB_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={currentLocation}
                        onChange={handleLocationChange}
                        placeholder="City, Country, or Remote"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                </div>

                {/* Salary Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="minSalary"
                            value={currentMinSalary}
                            onChange={handleSalaryChange}
                            placeholder="Min"
                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                        <input
                            type="number"
                            name="maxSalary"
                            value={currentMaxSalary}
                            onChange={handleSalaryChange}
                            placeholder="Max"
                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                        value={searchParams.get('sort') || ''}
                        onChange={(e) => updateFilters({ sort: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="">Newest First</option>
                        <option value="relevance">Relevance</option>
                        <option value="salary_desc">Salary: High to Low</option>
                        <option value="salary_asc">Salary: Low to High</option>
                    </select>
                </div>

                {/* Skills */}
                <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS_LIST.map(skill => (
                            <button
                                key={skill}
                                onClick={() => handleSkillToggle(skill)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currentSkills.includes(skill)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
