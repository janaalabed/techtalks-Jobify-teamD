"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, ChevronRight, Sparkles, MousePointer2 } from "lucide-react";
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
    <div className="flex flex-col h-screen bg-[#edf0f7] overflow-hidden font-sans">
      <Navbar />

      <div className="flex-1 overflow-y-auto custom-scrollbar">

        <header className="bg-white border-b border-slate-200/60">
        
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <span>Dashboard</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-[#5f5aa7]">Career Opportunities</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-[#170e2c] tracking-tight">
                  Find your next <span className="text-[#3e3875]">Big Move.</span>
                </h1>
              </div>
           
              <div className="hidden sm:flex items-center self-start md:self-auto gap-2 px-4 py-2 rounded-2xl bg-[#5f5aa7]/5 border border-[#5f5aa7]/10 text-[#3e3875] text-xs font-black uppercase tracking-tighter shadow-sm">
                <Sparkles size={14} className="text-[#5f5aa7]" /> {jobs.length} Opportunities Available
              </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="bg-[#e6e2ed] p-2 rounded-[2rem] shadow-2xl shadow-[#3e3875]/20">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-[3] flex flex-col md:flex-row items-center gap-2">
                  {/* Title Search */}
                  <div className="w-full flex items-center bg-white backdrop-blur-sm rounded-2xl px-4 py-1 border border-white/20 focus-within:bg-white transition-all">
                    <Search size={18} className="text-[#7270b1] shrink-0" />
                    <input
                      value={q} onChange={(e) => setQ(e.target.value)}
                      placeholder="Role or Keywords..."
                      className="w-full bg-transparent py-3 px-2 outline-none text-sm font-bold placeholder:text-slate-500"
                    />
                  </div>
                  {/* Location Search */}
                  <div className="w-full flex items-center bg-white backdrop-blur-sm rounded-2xl px-4 py-1 border border-white/20 focus-within:bg-white transition-all">
                    <MapPin size={18} className="text-[#7270b1] shrink-0" />
                    <input
                      value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="Preferred City..."
                      className="w-full bg-transparent py-3 px-2 outline-none text-sm font-bold placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex-[2] flex flex-col sm:flex-row items-center gap-2">
                  <select
                    value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full sm:flex-1 bg-white rounded-2xl px-4 py-4 text-[13px] font-black outline-none cursor-pointer hover:bg-slate-50 transition-all appearance-none"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>

                  <select
                    value={paid} onChange={(e) => setPaid(e.target.value)}
                    className="w-full sm:flex-1 bg-white rounded-2xl px-4 py-4 text-[13px] font-black outline-none cursor-pointer hover:bg-slate-50 transition-all appearance-none"
                  >
                    <option value="">Salary Any</option>
                    <option value="true">Paid Only</option>
                    <option value="false">Unpaid</option>
                  </select>

                  <button
                    onClick={fetchJobs}
                    className="w-full lg:w-auto bg-[#3e3875] hover:bg-[#170e2c] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 py-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-[#170e2c]">Available Positions</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-[#5f5aa7]/10 border-t-[#3e3875] rounded-full animate-spin"></div>
                  <MousePointer2 className="absolute text-[#3e3875] animate-bounce" size={20} />
                </div>
                <p className="text-[10px] font-black text-[#7270b1] tracking-[0.3em] uppercase">Syncing listings...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
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