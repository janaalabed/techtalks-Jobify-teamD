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
    <div className="min-h-screen bg-[#edf0f7]">
      <Navbar companyName={employer?.company_name} />

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#170e2c] flex items-center gap-3">
              <LayoutDashboard className="text-[#3e3875]" />
              {employer?.company_name} Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage your job listings and track applicants.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-[#3e3875] hover:bg-[#170e2c] text-white px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 font-semibold"
          >
            <Plus size={20} />
            Post New Job
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-[#3e3875] rounded-lg">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Listings</p>
                <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
              </div>
            </div>
          </div>

        </div>


        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-[#170e2c]">Your Job Openings</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e3875]"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-slate-400" size={30} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No jobs posted yet</h3>
                <p className="text-slate-500">Get started by creating your first job listing.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="group border border-slate-100 rounded-xl p-5  hover:border-[#3e3875]/30 hover:bg-[#e0e2ff]  hover:shadow-md transition-all bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3e3875] transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {job.location}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold uppercase tracking-wider">
                            {job.type}
                          </span>
                          {job.paid && (
                            <span className="text-emerald-600 font-medium">
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => setEditJobId(job.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3e3875] rounded-lg hover:bg-[#170e2c] transition-all active:scale-[0.98] shadow-sm"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteJobId(job.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={16} /> Delete
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