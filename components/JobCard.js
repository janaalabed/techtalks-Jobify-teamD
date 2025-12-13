import Link from 'next/link';

export default function JobCard({ job }) {
    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                            {job.company_name}
                        </p>
                    </div>
                    {job.logo_url && (
                        <div className="ml-4 flex-shrink-0">
                            <img
                                src={job.logo_url}
                                alt={`${job.company_name} logo`}
                                className="h-12 w-12 object-contain rounded-md border border-gray-100"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center text-gray-600 mb-4 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                </div>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.type}
                        </span>
                        {job.paid && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                            </span>
                        )}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {job.description}
                    </p>

                    <p className="text-xs text-gray-400">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </Link>
    );
}
