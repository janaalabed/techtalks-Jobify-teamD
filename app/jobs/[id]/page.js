import Link from 'next/link';

// Mock job data matching DB schema (Jobs + Companies)
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        location: 'Beirut, Lebanon',
        summary: 'We are looking for an experienced frontend developer to join our team and build amazing user experiences with React and Next.js.',
        description: 'As a Senior Frontend Developer, you will be responsible for building and maintaining our web applications using modern technologies. You will work closely with our design and backend teams to create seamless user experiences.',
        responsibilities: [
            'Build responsive web applications using React and Next.js',
            'Collaborate with design team to implement UI/UX designs',
            'Write clean, maintainable, and well-documented code',
            'Mentor junior developers and conduct code reviews',
            'Optimize application performance and accessibility'
        ],
        requirements: [
            '5+ years of experience with React and modern JavaScript',
            'Strong understanding of TypeScript',
            'Experience with Next.js and server-side rendering',
            'Excellent communication and collaboration skills',
            'Portfolio demonstrating frontend expertise'
        ],
        company: {
            name: 'TechCorp Inc.',
            logo: null
        }
    },
    {
        id: 2,
        title: 'Full Stack Engineer',
        location: 'Tripoli, Lebanon',
        summary: 'Join our dynamic team to build scalable web applications using cutting-edge technologies across the full stack.',
        description: 'We need a talented Full Stack Engineer who can work on both frontend and backend systems. You will be involved in the entire development lifecycle from design to deployment.',
        responsibilities: [
            'Develop full-stack features using React and Node.js',
            'Design and implement database schemas',
            'Build and maintain RESTful APIs',
            'Deploy and monitor applications in cloud environments',
            'Participate in agile development processes'
        ],
        requirements: [
            '3+ years of full-stack development experience',
            'Proficiency with Node.js and React',
            'Database knowledge (PostgreSQL, MongoDB)',
            'Experience with cloud platforms (AWS, GCP, or Azure)',
            'Understanding of DevOps practices'
        ],
        company: {
            name: 'StartupHub',
            logo: null
        }
    },
    {
        id: 3,
        title: 'UX/UI Designer',
        location: 'Remote',
        summary: 'Create beautiful and intuitive user interfaces for our products and help shape the user experience across all platforms.',
        description: 'As a UX/UI Designer, you will work closely with product managers and developers to create exceptional user experiences. You will be responsible for the entire design process from research to final implementation.',
        responsibilities: [
            'Design user interfaces for web and mobile applications',
            'Create wireframes, prototypes, and high-fidelity mockups',
            'Conduct user research and usability testing',
            'Maintain and evolve our design system',
            'Collaborate with developers to ensure design implementation'
        ],
        requirements: [
            '3+ years of UX/UI design experience',
            'Proficiency in Figma and Adobe Creative Suite',
            'Strong portfolio showcasing design work',
            'Understanding of design principles and best practices',
            'Experience with responsive and mobile-first design'
        ],
        company: {
            name: 'DesignStudio Co.',
            logo: null
        }
    },
    {
        id: 4,
        title: 'Backend Developer',
        location: 'Jounieh, Lebanon',
        summary: 'Build robust and scalable backend systems to power our applications and handle millions of requests daily.',
        description: 'We are seeking a Backend Developer to design and implement server-side logic and database architecture. You will work on building APIs and microservices that power our platform.',
        responsibilities: [
            'Develop and maintain RESTful APIs and microservices',
            'Optimize database queries and schema design',
            'Implement security measures and authentication systems',
            'Write comprehensive unit and integration tests',
            'Monitor and improve system performance'
        ],
        requirements: [
            '4+ years of backend development experience',
            'Strong knowledge of Python or Node.js',
            'Experience with relational and NoSQL databases',
            'Understanding of system design and architecture',
            'Familiarity with containerization (Docker, Kubernetes)'
        ],
        company: {
            name: 'CloudTech Solutions',
            logo: null
        }
    },
    {
        id: 5,
        title: 'DevOps Engineer',
        location: 'Sidon, Lebanon',
        summary: 'Manage our infrastructure and deployment pipelines to ensure smooth operations and continuous delivery.',
        description: 'As a DevOps Engineer, you will be responsible for maintaining and improving our CI/CD pipelines and infrastructure. You will work to automate processes and ensure system reliability.',
        responsibilities: [
            'Manage cloud infrastructure on AWS/Azure',
            'Build and maintain CI/CD pipelines',
            'Monitor system performance and reliability',
            'Automate deployment and scaling processes',
            'Implement infrastructure as code practices'
        ],
        requirements: [
            '3+ years of DevOps experience',
            'Experience with Docker and Kubernetes',
            'Knowledge of AWS or Azure cloud platforms',
            'Scripting skills (Bash, Python, or Go)',
            'Understanding of networking and security'
        ],
        company: {
            name: 'InfraTech Inc.',
            logo: null
        }
    },
    {
        id: 6,
        title: 'Product Manager',
        location: 'Zahle, Lebanon',
        summary: 'Lead product strategy and work with cross-functional teams to deliver exceptional products that users love.',
        description: 'We need a Product Manager to define product vision, strategy, and roadmap. You will work closely with engineering, design, and business teams to bring products to market.',
        responsibilities: [
            'Define product roadmap and prioritize features',
            'Gather and analyze user feedback and metrics',
            'Work with engineering and design teams on execution',
            'Conduct market research and competitive analysis',
            'Present product updates to stakeholders'
        ],
        requirements: [
            '5+ years of product management experience',
            'Strong analytical and problem-solving skills',
            'Excellent communication and leadership abilities',
            'Technical background or understanding preferred',
            'Experience with agile methodologies'
        ],
        company: {
            name: 'ProductFirst LLC',
            logo: null
        }
    }
];

export default async function JobDetailsPage({ params }) {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id);
    const job = MOCK_JOBS.find(j => j.id === jobId);

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
                            Sorry, we couldn't find the job you're looking for. It may have been removed or the ID is invalid.
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
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <p className="text-xl text-blue-600 font-medium mb-2">{job.company.name}</p>
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Responsibilities</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {job.responsibilities.map((resp, index) => (
                                <li key={index} className="text-gray-700">{resp}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {job.requirements.map((req, index) => (
                                <li key={index} className="text-gray-700">{req}</li>
                            ))}
                        </ul>
                    </div>

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
