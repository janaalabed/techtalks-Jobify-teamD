import Link from 'next/link';

export default function JobCard({ job }) {
    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-400">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                        {job.title}
                    </h3>
                </div>

                <p className="text-blue-600 font-medium mb-2">
                    {job.company.name}
                </p>

                <p className="text-gray-600 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                </p>

                <p className="text-gray-700 line-clamp-2">
                    {job.summary}
                </p>
            </div>
        </Link>
    );
}
