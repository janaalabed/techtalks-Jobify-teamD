
"use client";
import { FaUserGraduate, FaBuilding, FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
         <div className="text-center max-w-3xl mx-auto mb-20">
          
           <h2 className="text-4xl font-bold mb-14 text-[#2529a1]">
             How Jobify Works
           </h2>
           <p className="text-gray-600 text-lg mt-5">
             Whether you’re applying for a job or hiring talent, Jobify makes
             everything smooth and fast.
           </p>
         </div>

        <div className="grid md:grid-cols-2 gap-14">

          {/* Applicants */}
         <div className="relative bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl transition">
  <div className="flex items-center gap-4 mb-8">
    <div className="bg-[#2529a1]/15 p-3 rounded-xl">
      <FaUserGraduate className="text-[#2529a1] w-7 h-7" />
    </div>
    <h3 className="text-2xl md:text-3xl font-semibold">
      For Applicants
    </h3>
  </div>

  <ul className="space-y-5">
    {[
      "Create your professional profile",
      "Upload your CV once",
      "Apply to opportunities with one click",
      "Track application status in real-time",
    ].map((step, i) => (
      <li key={i} className="flex gap-4 items-start">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2529a1] text-white flex items-center justify-center font-semibold">
          {i + 1}
        </span>
        <span className="text-gray-700 text-lg">{step}</span>
      </li>
    ))}
  </ul>

  {/* CTA */}
  <div className="mt-10 bg-[#2529a1]/10 border border-[#2529a1]/25 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div>
      <h4 className="font-semibold text-xl text-gray-900">
        Start applying today
      </h4>
      <p className="text-gray-600">
        Discover jobs and internships tailored for you.
      </p>
    </div>
    <a
      href="../register/"
      className="bg-[#2529a1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1f238f] transition"
    >
      Browse Jobs
    </a>
  </div>
</div>

          {/* Employers */}
         <div className="relative bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl transition">
  <div className="flex items-center gap-4 mb-8">
    <div className="bg-[#f5af71]/20 p-3 rounded-xl">
      <FaBuilding className="text-[#f5af71] w-7 h-7" />
    </div>
    <h3 className="text-2xl md:text-3xl font-semibold">
      For Employers
    </h3>
  </div>

  <ul className="space-y-5">
    {[
      "Create a company profile",
      "Post job & internship offers",
      "Review applicants easily",
      "Accept or reject in one click",
    ].map((step, i) => (
      <li key={i} className="flex gap-4 items-start">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f5af71] text-white flex items-center justify-center font-semibold">
          {i + 1}
        </span>
        <span className="text-gray-700 text-lg">{step}</span>
      </li>
    ))}
  </ul>

  {/* CTA */}
  <div className="mt-10 bg-[#f5af71]/15 border border-[#f5af71]/40 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div>
      <h4 className="font-semibold text-xl text-gray-900">
        Hire faster with Jobify
      </h4>
      <p className="text-gray-600">
        Reach qualified candidates in minutes.
      </p>
    </div>
    <a
      href="../register/"
      className="bg-[#f5af71] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e89c5b] transition"
    >
      Start Hiring
    </a>
  </div>
</div>

         </div>

         <div className="mt-20 text-center text-gray-600 flex items-center justify-center gap-3">
           <FaCheckCircle className="text-[#2529a1]" />
          <span>No complexity. No hidden steps. Just results.</span>
         </div>
       </div>
    </section>
  );
}
