"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../../lib/supabaseClient";
import JobModal from "../../../components/companyDashboardComponents/JobModal";
import ConfirmDeleteModal from "../../../components/companyDashboardComponents/ConfirmDeleteModal";
import Navbar from "../../../components/companyDashboardComponents/NavBar";
import { Plus, Briefcase, Users, MapPin, Edit3, Trash2, LayoutDashboard } from "lucide-react";

export default function EmployerDashboardPage() {
  const supabase = getSupabase();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [deleteJobId, setDeleteJobId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push("/login");
        return;
      }
      setUser(userData.user);

      const { data: empData, error: empError } = await supabase
        .from("employers")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (empError || !empData) {
        router.push("/employers/create");
        return;
      }
      setEmployer(empData);
    };
    loadData();
  }, [router, supabase]);

  const fetchJobs = async () => {
    if (!employer) return;
    setLoading(true);
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", employer.id)
      .order("created_at", { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [employer]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar companyName={employer?.company_name} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#170e2c] flex items-center gap-3">
              <LayoutDashboard className="text-[#3e3875]" size={32} />
              Dashboard
            </h1>
            <p className="text-[#7270b1] mt-1 font-medium">
              Welcome back, <span className="text-[#3e3875] font-bold">{employer?.company_name}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center justify-center gap-2 bg-[#170e2c] hover:bg-[#3e3875] text-white px-8 py-4 rounded-2xl shadow-xl shadow-[#170e2c]/10 transition-all active:scale-95 font-black uppercase tracking-tight text-sm"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Post New Job
          </button>
        </div>

        {/* Stats Quick View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-[#170e2c]/5">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#5f5aa7]/10 text-[#3e3875] rounded-2xl">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="text-[11px] font-black text-[#7270b1] uppercase tracking-widest">Active Listings</p>
                <p className="text-3xl font-black text-[#170e2c]">{jobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job List Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-[#170e2c]/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h2 className="font-black text-[#170e2c] uppercase tracking-tight">Your Job Openings</h2>
            <span className="text-xs font-bold bg-[#3e3875]/10 text-[#3e3875] px-3 py-1 rounded-full">
              {jobs.length} Total
            </span>
          </div>

          <div className="p-4 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#3e3875]/20 border-t-[#3e3875]"></div>
                <p className="text-sm font-bold text-[#7270b1]">Loading your listings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Briefcase className="text-slate-300" size={36} />
                </div>
                <h3 className="text-xl font-black text-[#170e2c]">No jobs posted yet</h3>
                <p className="text-[#7270b1] font-medium mt-2">Ready to find your next great hire?</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="group bg-white border border-slate-100 rounded-[1.5rem] p-5 md:p-6 hover:border-[#5f5aa7]/30 hover:shadow-lg hover:shadow-[#170e2c]/5 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-black text-[#170e2c] group-hover:text-[#3e3875] transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1.5 font-bold text-[#7270b1] bg-slate-50 px-3 py-1.5 rounded-lg">
                            <MapPin size={14} className="text-[#5f5aa7]" /> {job.location}
                          </span>
                          <span className="px-3 py-1.5 bg-[#5f5aa7]/10 text-[#5f5aa7] rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {job.type}
                          </span>
                          {job.paid && (
                            <span className="text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-lg text-xs">
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => setEditJobId(job.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-black text-[#3e3875] bg-[#3e3875]/5 rounded-xl hover:bg-[#3e3875] hover:text-white transition-all active:scale-[0.98]"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteJobId(job.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-black text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {showCreateModal && (
          <JobModal
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => { setShowCreateModal(false); fetchJobs(); }}
          />
        )}
        {editJobId && (
          <JobModal
            key={editJobId}
            mode="edit"
            jobId={editJobId}
            onClose={() => setEditJobId(null)}
            onSuccess={() => { setEditJobId(null); fetchJobs(); }}
          />
        )}
        {deleteJobId && (
          <ConfirmDeleteModal
            onCancel={() => setDeleteJobId(null)}
            onConfirm={async () => {
              await supabase.from("jobs").delete().eq("id", deleteJobId);
              setDeleteJobId(null);
              fetchJobs();
            }}
          />
        )}
      </main>
    </div>
  );
}