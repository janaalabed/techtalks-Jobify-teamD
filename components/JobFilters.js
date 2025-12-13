'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'TypeScript', 'AWS', 'Docker'];

export default function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        type: '',
        skills: [],
        minSalary: '',
        maxSalary: '',
        location: ''
    });

    useEffect(() => {
        // Initialize filters from URL params
        const type = searchParams.get('type') || '';
        const skillsParam = searchParams.get('skills');
        const skills = skillsParam ? skillsParam.split(',') : [];
        const minSalary = searchParams.get('minSalary') || '';
        const maxSalary = searchParams.get('maxSalary') || '';
        const location = searchParams.get('location') || '';

        setFilters({ type, skills, minSalary, maxSalary, location });
    }, [searchParams]);

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        const params = new URLSearchParams();

        if (newFilters.type) params.set('type', newFilters.type);
        if (newFilters.skills.length > 0) params.set('skills', newFilters.skills.join(','));
        if (newFilters.minSalary) params.set('minSalary', newFilters.minSalary);
        if (newFilters.maxSalary) params.set('maxSalary', newFilters.maxSalary);
        if (newFilters.location) params.set('location', newFilters.location);

        router.push(`?${params.toString()}`);
    };

    const handleTypeChange = (e) => {
        updateFilters({ ...filters, type: e.target.value });
    };

    const handleSkillToggle = (skill) => {
        const newSkills = filters.skills.includes(skill)
            ? filters.skills.filter(s => s !== skill)
            : [...filters.skills, skill];
        updateFilters({ ...filters, skills: newSkills });
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        updateFilters({ ...filters, [name]: value });
    };

    const handleLocationChange = (e) => {
        updateFilters({ ...filters, location: e.target.value });
    };

    const clearFilters = () => {
        const emptyFilters = {
            type: '',
            skills: [],
            minSalary: '',
            maxSalary: '',
            location: ''
        };
        setFilters(emptyFilters);
        router.push('?');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Clear Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Job Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                        value={filters.type}
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
                        value={filters.location}
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
                            value={filters.minSalary}
                            onChange={handleSalaryChange}
                            placeholder="Min"
                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                        <input
                            type="number"
                            name="maxSalary"
                            value={filters.maxSalary}
                            onChange={handleSalaryChange}
                            placeholder="Max"
                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>
                </div>

                {/* Skills */}
                <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS_LIST.map(skill => (
                            <button
                                key={skill}
                                onClick={() => handleSkillToggle(skill)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filters.skills.includes(skill)
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
