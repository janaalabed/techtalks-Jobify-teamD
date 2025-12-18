import Link from 'next/link';
import Image from 'next/image';
import { getJobById } from '@/db/queries/jobQueries';

export default async function JobDetailsPage({ params }) {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id);

    // Fetch job from database
    let job = null;
    try {
        job = await getJobById(jobId);
    } catch (error) {
        console.error("Error fetching job:", error);
        // Fall through to "Job Not Found" or handle specifically
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
                        <p className="text-gray-600 mb-6">
                            Sorry, we couldn&apos;t find the job you&apos;re looking for. It may have been removed or the ID is invalid.
                        </p>
                        <Link
                            href="/jobs"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Parse skills if it's a string (handling potential DB format variations)
    const skills = Array.isArray(job.skills) ? job.skills : (job.skills ? job.skills.split(',') : []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/jobs"
                    className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Jobs
                </Link>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <p className="text-xl text-blue-600 font-medium mb-2">{job.company_name}</p>
                            <div className="flex items-center text-gray-600 mb-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {job.type}
                                </span>
                                {job.salary_min && job.salary_max && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        {job.logo_url && (
                            <div className="ml-4 flex-shrink-0 relative h-20 w-20">
                                <Image
                                    src={job.logo_url}
                                    alt={`${job.company_name} logo`}
                                    fill
                                    className="object-contain rounded-lg border border-gray-100"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>

                    {/* Skills Section */}
                    {skills.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Note: Responsibilities and Requirements are not in the standard DB schema shown in queries.
                        If they exist in the DB, they should be added here. For now, we rely on the description.
                    */}

                    <div className="pt-6 border-t border-gray-200">
                        <Link
                            href="/jobs"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Back to All Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
