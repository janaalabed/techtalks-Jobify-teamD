"use client";

import { useEffect, useState } from "react";
import getSupabase from "../../lib/supabaseClient";
import {
  Loader2,
  Trash2,
  Users,
  Briefcase,
  FileText,
  Eye,
  X,
  LayoutDashboard,
  ArrowUpRight,
  Menu,
  RotateCw,
  MapPin,
  DollarSign,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const supabase = getSupabase();

  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({});
  const [userFilter, setUserFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  /* ---------------- DATA FETCHING ---------------- */
  const fetchAll = async () => {
    setLoading(true);

    const [
      { data: profiles, error: userError },
      { data: jobsData, error: jobsError },
      { data: applicationsData, error: applicationsError },
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      // Explicitly naming the foreign key relationship to ensure the join works
      supabase.from("jobs").select("*, employers!jobs_employer_id_fkey(company_name)"),
      supabase.from("applications").select("*"),
    ]);

    if (userError) console.error("Users fetch error:", userError);
    if (jobsError) console.error("Jobs fetch error:", jobsError.message);
    if (applicationsError) console.error("Applications fetch error:", applicationsError);

    setUsers(profiles || []);
    setJobs(jobsData || []);
    setApplications(applicationsData || []);

    setStats({
      users: profiles?.length || 0,
      applicants: profiles?.filter((u) => u.role === "applicant").length || 0,
      employers: profiles?.filter((u) => u.role === "employer").length || 0,
      jobs: jobsData?.length || 0,
      applications: applicationsData?.length || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteRow = async (table, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      fetchAll();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredUsers =
    userFilter === "all" ? users : users.filter((u) => u.role === userFilter);

  return (
  <div className="min-h-screen bg-[#170e2c] text-white font-sans">
    {/* MOBILE TOP NAV - Added for responsiveness */}
    <div className="lg:hidden flex items-center justify-between p-4 bg-[#3e3875] border-b border-[#7270b1]/30">
      <div className="flex items-center gap-2">
        <LayoutDashboard size={20} className="text-[#7270b1]" />
        <span className="font-black uppercase tracking-tighter text-sm">Admin Panel</span>
      </div>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 bg-[#170e2c] rounded-lg"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>

    <div className="flex relative">
      {/* SIDEBAR NAVIGATION - Updated with mobile overlay logic */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#3e3875] p-6 transform transition-transform duration-300 border-r border-[#7270b1]/30
        lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <LayoutDashboard className="text-[#7270b1]" />
          <span className="text-xl font-black tracking-tight uppercase">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-1">
          {["users", "jobs", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsSidebarOpen(false); // Close on mobile after selection
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 capitalize font-semibold ${
                activeTab === tab
                  ? "bg-[#5f5aa7] text-white shadow-lg shadow-black/20"
                  : "text-slate-300 hover:bg-[#5f5aa7]/20 hover:text-white"
              }`}
            >
              {tab === "users" && <Users size={18} />}
              {tab === "jobs" && <Briefcase size={18} />}
              {tab === "applications" && <FileText size={18} />}
              {tab}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#7270b1]/20">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold"
          >
            <Home size={18} />
            Exit to Site
          </Link>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              System Overview
            </h1>
            <p className="text-[#7270b1] font-medium text-sm md:text-base">
              Manage your platform data and users
            </p>
          </div>

          <button
            onClick={fetchAll}
            className="flex items-center gap-2 bg-[#3e3875] hover:bg-[#5f5aa7] px-4 py-2.5 rounded-xl transition-all shadow-lg text-sm font-bold"
          >
            <RotateCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </header>

        {/* STATS GRID - Optimized for small screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
          {[
            ["Total Users", stats.users, Users, "all"],
            ["Applicants", stats.applicants, Users, "applicant"],
            ["Employers", stats.employers, Users, "employer"],
            ["Active Jobs", stats.jobs, Briefcase, null],
            ["Applications", stats.applications, FileText, null],
          ].map(([label, value, Icon, filter]) => (
            <div
              key={label}
              onClick={() => {
                if (label === "Active Jobs") setActiveTab("jobs");
                else if (label === "Applications") setActiveTab("applications");
                else {
                  setActiveTab("users");
                  setUserFilter(filter);
                }
              }}
              className="group cursor-pointer bg-[#3e3875]/40 border border-[#7270b1]/20 p-4 md:p-5 rounded-2xl hover:border-[#5f5aa7] transition-all"
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="p-2 w-fit bg-[#170e2c] rounded-lg group-hover:bg-[#5f5aa7] transition-colors">
                  <Icon size={18} className="text-[#7270b1] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#7270b1] uppercase tracking-wider line-clamp-1">
                    {label}
                  </p>
                  <p className="text-xl md:text-2xl font-black mt-1">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-[#3e3875]/20 border border-[#7270b1]/20 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 md:p-6 border-b border-[#7270b1]/20 bg-[#3e3875]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg md:text-xl font-bold capitalize">
              {activeTab} Management
            </h2>
            {activeTab === "users" && (
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#170e2c] border border-[#7270b1]/40 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#5f5aa7]"
              >
                <option value="all">All Roles</option>
                <option value="applicant">Applicants</option>
                <option value="employer">Employers</option>
              </select>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-[#5f5aa7]" size={40} />
                  <p className="text-[#7270b1] font-semibold text-center px-4">
                    Synchronizing Database...
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === "users" && (
                    <Table
                      headers={["User Name", "Account Type", "Join Date", "Actions"]}
                      rows={filteredUsers.map((u) => [
                        <span className="font-bold text-slate-100">{u.name || "N/A"}</span>,
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === "employer" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {u.role}
                        </span>,
                        <span className="text-slate-400 text-xs">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>,
                        <DeleteButton key={u.id} onClick={() => deleteRow("profiles", u.id)} />,
                      ])}
                    />
                  )}

                  {activeTab === "jobs" && (
                    <Table
                      headers={["Position", "Organization", "Status", "Actions"]}
                      rows={jobs.map((j) => [
                        <span className="font-bold line-clamp-1">{j.title}</span>,
                        <span className="text-slate-200 line-clamp-1">{j.employers?.company_name || "Private"}</span>,
                        <span className="text-emerald-400 font-mono font-bold text-xs">{j.paid ? "Paid" : "Unpaid"}</span>,
                        <div key={j.id} className="flex gap-2">
                          <button onClick={() => setSelectedJob(j)} className="p-2 bg-[#5f5aa7] hover:bg-[#7270b1] rounded-lg transition-colors">
                            <Eye size={14} />
                          </button>
                          <DeleteButton onClick={() => deleteRow("jobs", j.id)} />
                        </div>,
                      ])}
                    />
                  )}

                  {activeTab === "applications" && (
                    <Table
                      headers={["Target Job", "Applicant", "Status"]}
                      rows={applications.map((a) => [
                        <span className="font-medium line-clamp-1">{jobs.find(j => j.id === a.job_id)?.title || "—"}</span>,
                        <span className="line-clamp-1">{users.find(u => u.id === a.applicant_id)?.name || "—"}</span>,
                        <span className="italic text-[#7270b1] text-xs">{a.status}</span>,
                      ])}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>

    {/* JOB MODAL - Refined for mobile height/scrolling */}
    {selectedJob && (
      <div className="fixed inset-0 bg-[#170e2c]/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
        <div className="bg-[#3e3875] border border-[#7270b1]/30 text-white p-6 md:p-10 rounded-[2rem] w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar">
          <button
            onClick={() => setSelectedJob(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-[#170e2c] hover:bg-red-500/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <span className="text-[#7270b1] uppercase text-[10px] font-black tracking-[0.2em]">
              Listing Insights
            </span>
            <h2 className="text-2xl md:text-4xl font-black mt-1 leading-tight">{selectedJob.title}</h2>
            <p className="text-lg md:text-xl text-[#a5a1e2] font-bold mt-2">
              {selectedJob.employers?.company_name || "Private Employer"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 bg-[#170e2c]/40 p-5 md:p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#3e3875] rounded-xl text-emerald-400"><DollarSign size={20} /></div>
              <div>
                <p className="text-[#7270b1] text-[10px] font-bold uppercase">Compensation</p>
                <p className="font-bold text-sm">{selectedJob.salary || "Negotiable"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#3e3875] rounded-xl text-blue-400"><MapPin size={20} /></div>
              <div>
                <p className="text-[#7270b1] text-[10px] font-bold uppercase">Workplace</p>
                <p className="font-bold text-sm">{selectedJob.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-[#a5a1e2] font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5f5aa7]" /> Description
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{selectedJob.description}</p>
            </section>
            <section>
              <h4 className="text-[#a5a1e2] font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5f5aa7]" /> Candidate Profile
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{selectedJob.requirements}</p>
            </section>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
function Table({ headers, rows }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} className="p-4 text-[#7270b1] font-black uppercase text-[10px] tracking-widest border-b border-[#7270b1]/10">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#7270b1]/10">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-[#5f5aa7]/5 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="p-4 text-sm font-medium">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function DeleteButton({ onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all">
      <Trash2 size={14} /> Delete
    </button>
  );
}