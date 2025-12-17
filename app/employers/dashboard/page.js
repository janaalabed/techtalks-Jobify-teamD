"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JobModal from "@/app/components/JobModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

const HARD_CODED_EMPLOYER_ID = 1; // TEMP: replace with real auth later

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Delete confirmation modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchJobs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("id, title, location, type, paid, salary, created_at")
      .eq("employer_id", HARD_CODED_EMPLOYER_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      setError(error.message || "Failed to load jobs.");
      setJobs([]);
    } else {
      setJobs(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const totalJobs = jobs.length;
  const paidJobs = jobs.filter((job) => job.paid).length;
  const unpaidJobs = totalJobs - paidJobs;

  function openCreateModal() {
    setModalMode("create");
    setSelectedJobId(null);
    setIsModalOpen(true);
  }

  function openEditModal(id) {
    setModalMode("edit");
    setSelectedJobId(id);
    setIsModalOpen(true);
  }

  function openDeleteModal(id) {
    setJobToDelete(id);
    setIsDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!jobToDelete) return;

    setDeleting(true);
    setError("");

    // optimistic UI
    const prevJobs = jobs;
    setJobs((cur) => cur.filter((j) => j.id !== jobToDelete));

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobToDelete)
      .eq("employer_id", HARD_CODED_EMPLOYER_ID);

    setDeleting(false);
    setIsDeleteOpen(false);
    setJobToDelete(null);

    if (error) {
      console.error("Delete error:", error);
      setError(error.message || "Failed to delete job.");
      setJobs(prevJobs); // rollback
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
             <Image
              src="/jobify-logo.jpg"
              alt="Jobify Logo"
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link
              href="/employers/dashboard"
              className="hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              href="/employers/profile"
              className="hover:text-slate-900"
            >
              Profile
            </Link>
            <Link
              href="/employers/applicants"
              className="hover:text-slate-900"
            >
              Applicants
            </Link>
          </nav>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Top header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Employer Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your job posts and quick stats.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchJobs}
              className="rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 px-4 py-2.5 hover:bg-slate-50 transition"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 shadow-sm hover:shadow transition flex items-center justify-center"
            >
              + Create Job
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-white shadow p-4">
            <p className="text-xs font-medium text-slate-500">Total Jobs</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalJobs}
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow p-4">
            <p className="text-xs font-medium text-slate-500">Paid Jobs</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {paidJobs}
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow p-4">
            <p className="text-xs font-medium text-slate-500">Unpaid Jobs</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {unpaidJobs}
            </p>
          </div>
        </div>

        {/* Jobs list */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              My Job Posts
            </h2>
            {loading && (
              <span className="text-xs text-slate-500">Loading...</span>
            )}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              You don’t have any job posts yet.
              <br />
              <button
                type="button"
                onClick={openCreateModal}
                className="text-blue-600 hover:underline font-medium"
              >
                Create your first job.
              </button>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2.5 pr-4">Title</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Paid</th>
                    <th className="py-2.5 px-4">Salary</th>
                    <th className="py-2.5 px-4">Created</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {job.title}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {job.location || "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-700 capitalize">
                        {job.type || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {job.paid ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {job.paid ? job.salary || "-" : "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(job.id)}
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(job.id)}
                            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <JobModal
          mode={modalMode}
          jobId={selectedJobId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchJobs();
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {isDeleteOpen && (
        <ConfirmDeleteModal
          title="Delete Job"
          message="Are you sure you want to delete this job? This action cannot be undone."
          loading={deleting}
          onCancel={() => {
            if (deleting) return;
            setIsDeleteOpen(false);
            setJobToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}
