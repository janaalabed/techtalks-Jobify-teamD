"use client";

import { FaUserGraduate, FaBuilding } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Applicant Column */}
          <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <FaUserGraduate className="text-blue-500 w-10 h-10" />
              <h3 className="text-2xl md:text-3xl font-semibold">For Applicants</h3>
            </div>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
              <li>Create a professional profile</li>
              <li>Upload your CV</li>
              <li>Discover opportunities</li>
              <li>Track all your applications in one dashboard</li>
            </ul>

            {/* Applicant CTA Highlight */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300 hover:bg-blue-100">
              <div className="text-gray-800">
                <h4 className="font-semibold text-xl md:text-2xl mb-1">
                  Ready to start applying?
                </h4>
                <p className="text-gray-700">Browse jobs and find your next opportunity fast.</p>
              </div>
              <a
                href="../register/"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition"
              >
                Browse Jobs
              </a>
            </div>
          </div>

          {/* Employer Column */}
          <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <FaBuilding className="text-green-500 w-10 h-10" />
              <h3 className="text-2xl md:text-3xl font-semibold">For Employers</h3>
            </div>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
              <li>Create a company profile</li>
              <li>Post jobs & internships</li>
              <li>Review applicants</li>
              <li>Accept or reject with one click</li>
            </ul>

            {/* Employer CTA Highlight */}
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300 hover:bg-green-100">
              <div className="text-gray-800">
                <h4 className="font-semibold text-xl md:text-2xl mb-1">
                  Hiring made easy
                </h4>
                <p className="text-gray-700">Post your openings and find qualified applicants fast.</p>
              </div>
              <a
                href="../register/"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition"
              >
                Start Hiring
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
