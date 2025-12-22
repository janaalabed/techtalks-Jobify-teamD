"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../../lib/supabaseClient";
import JobModal from "../../../components/companyDashboardComponents/JobModal";
import ConfirmDeleteModal from "../../../components/companyDashboardComponents/ConfirmDeleteModal";
import Navbar from "../../../components/companyDashboardComponents/NavBar";


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

  /* 🔐 Load authenticated user */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, [router, supabase]);

  /* 🏢 Load employer record */
  useEffect(() => {
    if (!user) return;

    const loadEmployer = async () => {
      const { data, error } = await supabase
        .from("employers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        router.push("/employers/create"); // force company profile creation
        return;
      }

      setEmployer(data);
    };

    loadEmployer();
  }, [user, router, supabase]);


  const fetchJobs = async () => {
    if (!employer) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", employer.id)
      .order("created_at", { ascending: false });

    if (!error) setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [employer]);



  return (
    <>
    <Navbar companyName={employer?.company_name} />
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          {employer?.company_name} Dashboard
        </h1>


        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg"
          >
            Create Job
          </button>

         
        </div>
      </div>

      {/* Jobs list */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-slate-600">No jobs posted yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-xl p-6 bg-white">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{job.title}</h2>
                  <p className="text-sm text-slate-500">
                    {job.location} • {job.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditJobId(job.id)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => setDeleteJobId(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <JobModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchJobs();
          }}
        />
      )}

      {/* Edit modal */}
      {editJobId && (
        <JobModal
          key={editJobId}
          mode="edit"
          jobId={editJobId}
          onClose={() => setEditJobId(null)}
          onSuccess={() => {
            setEditJobId(null);
            fetchJobs();
          }}
        />
      )}

      {/* Delete modal */}
      {deleteJobId && (
        <ConfirmDeleteModal
          onCancel={() => setDeleteJobId(null)}
          onConfirm={async () => {
            await supabase
              .from("jobs")
              .delete()
              .eq("id", deleteJobId)
              .eq("employer_id", employer.id);

            setDeleteJobId(null);
            fetchJobs();
          }}
        />
      )}
    </div>
    </>
  );

}
