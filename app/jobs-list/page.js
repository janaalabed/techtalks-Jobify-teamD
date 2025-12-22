"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobCard from "../../components/jobListingsComponents/JobCard";
import getSupabase from "../../lib/supabaseClient";
import Navbar from "../../components/jobListingsComponents/NavBar";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [paid, setPaid] = useState("");

  const router = useRouter();
  const supabase = getSupabase();

  
    //  FETCH JOBS
  
  async function fetchJobs() {
    const params = new URLSearchParams();

    if (q) params.append("q", q);
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (paid) params.append("paid", paid);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
        <Navbar  />
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Available Jobs</h1>

      
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs"
          className="border rounded-lg px-4 py-2"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded-lg px-4 py-2"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </select>

        <select
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Paid & Unpaid</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <button
        onClick={fetchJobs}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Apply Filters
      </button>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-gray-500 text-center">No jobs found</p>
        )}

        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
    </>
  );
}
