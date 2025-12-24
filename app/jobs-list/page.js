"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Filter, Sparkles, ChevronRight, LayoutGrid, ListFilter, SlidersHorizontal } from "lucide-react";
import JobCard from "../../components/jobListingsComponents/JobCard";
import getSupabase from "../../lib/supabaseClient";
import Navbar from "../../components/jobListingsComponents/NavBar";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [paid, setPaid] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = getSupabase();

  async function fetchJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (paid) params.append("paid", paid);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  async function fetchBookmarkedJobs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("bookmarks").select("job_id").eq("user_id", user.id);
    if (data) setBookmarkedJobs(data.map((b) => b.job_id));
  }

  useEffect(() => {
    fetchJobs();
    fetchBookmarkedJobs();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <Navbar />

      
      <div className="flex-1 overflow-y-auto">
        
       
        <header className="bg-white border-b border-slate-200 px-8 pt-6 pb-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Dashboard</span>
                <ChevronRight size={14} />
                <span className="text-[#3e3875]">Opportunities</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5f5aa7]/10 border border-[#5f5aa7]/20 text-[#3e3875] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={12} /> {jobs.length} Active Jobs
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-[2] flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl">
                <div className="flex-1 flex items-center px-3 gap-2">
                  <Search size={18} className="text-[#5f5aa7]" />
                  <input 
                    value={q} onChange={(e) => setQ(e.target.value)}
                    placeholder="Search job titles..." 
                    className="w-full bg-transparent py-2 outline-none text-sm font-medium text-[#170e2c] placeholder:text-slate-400"
                  />
                </div>
                <div className="w-px h-6 bg-slate-200 hidden md:block" />
                <div className="flex-1 flex items-center px-3 gap-2">
                  <MapPin size={18} className="text-[#5f5aa7]" />
                  <input 
                    value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location..." 
                    className="w-full bg-transparent py-2 outline-none text-sm font-medium text-[#170e2c] placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <select
                    value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs font-bold appearance-none focus:ring-2 focus:ring-[#5f5aa7]/20 outline-none cursor-pointer"
                  >
                    <option value="">All Schedules</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                <div className="relative flex-1">
                  <select
                    value={paid} onChange={(e) => setPaid(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs font-bold appearance-none focus:ring-2 focus:ring-[#5f5aa7]/20 outline-none cursor-pointer"
                  >
                    <option value="">Any Pay</option>
                    <option value="true">Paid</option>
                    <option value="false">Unpaid</option>
                  </select>
                  <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                <button 
                  onClick={fetchJobs}
                  className="bg-[#3e3875] hover:bg-[#170e2c] text-white px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-[#3e3875]/20"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Body content following the header in the scroll flow */}
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#170e2c] tracking-tight">Latest Openings</h2>
              
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-4 border-[#5f5aa7]/20 border-t-[#3e3875] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-[#7270b1] tracking-[0.2em] uppercase animate-pulse">Refreshing Feed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    bookmarked={bookmarkedJobs.includes(job.id)}
                    onToggleBookmark={(jobId) =>
                      setBookmarkedJobs((prev) =>
                        prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}