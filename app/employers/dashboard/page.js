"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import getSupabase from "../../../lib/supabaseClient";
import JobModal from "../../../components/JobModal";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";


export default function EmployerDashboardPage() {
  const supabase = getSupabase();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [deleteJobId, setDeleteJobId] = useState(null);

  const EMPLOYER_ID = 1;

  async function fetchJobs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", EMPLOYER_ID)
      .order("created_at", { ascending: false });

    if (!error) {
      setJobs(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">
          Employer Dashboard
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition"
        >
          Create Job
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-600">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {job.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {job.location} • {job.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditJobId(job.id)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteJobId(job.id)}
                    className="rounded-lg border border-red-300 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {editJobId && (
        <JobModal
          mode="edit"
          jobId={editJobId}
          onClose={() => setEditJobId(null)}
          onSuccess={() => {
            setEditJobId(null);
            fetchJobs();
          }}
        />
      )}

      {deleteJobId && (
        <ConfirmDeleteModal
          onCancel={() => setDeleteJobId(null)}
          onConfirm={async () => {
            await supabase
              .from("jobs")
              .delete()
              .eq("id", deleteJobId)
              .eq("employer_id", EMPLOYER_ID);

            setDeleteJobId(null);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
}
