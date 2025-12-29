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
} from "lucide-react";

export default function AdminPage() {
  const supabase = getSupabase();

  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({});
  const [userFilter, setUserFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  /* ---------------- DATA ---------------- */
  const fetchAll = async () => {
    setLoading(true);

    const [{ data: profiles, error: userError },
           { data: jobs, error: jobsError },
           { data: applications, error: applicationsError }] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("jobs").select("*"),
      supabase.from("applications").select("*"),
    ]);

    if (userError) console.error("Users fetch error:", userError);
    if (jobsError) console.error("Jobs fetch error:", jobsError);
    if (applicationsError) console.error("Applications fetch error:", applicationsError);

    setUsers(profiles || []);
    setJobs(jobs || []);
    setApplications(applications || []);

    setStats({
      users: profiles?.length || 0,
      applicants: profiles?.filter((u) => u.role === "applicant").length || 0,
      employers: profiles?.filter((u) => u.role === "employer").length || 0,
      jobs: jobs?.length || 0,
      applications: applications?.length || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const deleteRow = async (table, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      fetchAll();
    } catch (err) {
      console.error(`Error deleting ${table} with id ${id}:`, err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredUsers = userFilter === "all" ? users : users.filter((u) => u.role === userFilter);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3f2b6b] via-[#5f3ea1] to-[#170e2c] text-white">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            ["Users", stats.users, Users],
            ["Applicants", stats.applicants, Users],
            ["Employers", stats.employers, Users],
            ["Jobs", stats.jobs, Briefcase],
            ["Applications", stats.applications, FileText],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              onClick={() => {
                if (label === "Jobs") setActiveTab("jobs");
                if (label === "Applications") setActiveTab("applications");
                if (label === "Users") { setActiveTab("users"); setUserFilter("all"); }
                if (label === "Applicants") { setActiveTab("users"); setUserFilter("applicant"); }
                if (label === "Employers") { setActiveTab("users"); setUserFilter("employer"); }
              }}
              className="cursor-pointer bg-purple-500/30 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div className="flex items-center gap-3">
                <Icon />
                <div>
                  <p className="text-sm opacity-80">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          {["users", "jobs", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg capitalize transition ${
                activeTab === tab ? "bg-purple-600 shadow-lg" : "bg-purple-800/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-purple-900/30 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {/* USERS */}
              {activeTab === "users" && (
                <Table
                  headers={["Name", "Role", "Joined", "Actions"]}
                  rows={filteredUsers.map((u) => [
                    u.name || "—",
                    u.role,
                    new Date(u.created_at).toLocaleDateString(),
                    <DeleteButton key={u.id} onClick={() => deleteRow("profiles", u.id)} />,
                  ])}
                />
              )}

              {/* JOBS */}
              {activeTab === "jobs" && (
                <Table
                  headers={["Title", "Company", "Paid", "Actions"]}
                  rows={jobs.map((j) => [
                    j.title,
                    j.company_name || "—",
                    j.paid ? "Yes" : "No",
                    <div key={j.id} className="flex gap-2">
                      <button
                        onClick={() => setSelectedJob(j)}
                        className="px-3 py-1 bg-purple-600 rounded-lg flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                      <DeleteButton onClick={() => deleteRow("jobs", j.id)} />
                    </div>,
                  ])}
                />
              )}

              {/* APPLICATIONS */}
              {activeTab === "applications" && (
                <Table
                  headers={["Job", "Applicant", "Status"]}
                  rows={applications.map((a) => {
                    const job = jobs.find((j) => j.id === a.job_id);
                    const user = users.find((u) => u.id === a.applicant_id);
                    return [job?.title || "—", user?.name || "—", a.status];
                  })}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* JOB MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl w-[90%] max-w-xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
            <p><b>Company:</b> {selectedJob.company_name}</p>
            <p><b>Description:</b> {selectedJob.description}</p>
            <p><b>Requirements:</b> {selectedJob.requirements}</p>
            <p><b>Salary:</b> {selectedJob.salary || "—"}</p>
            <p><b>Location:</b> {selectedJob.location}</p>
            <p><b>Paid:</b> {selectedJob.paid ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function Table({ headers, rows }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} className="p-3 border-b border-white/20">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="odd:bg-white/5">
            {row.map((cell, j) => (
              <td key={j} className="p-3">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-1"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}
