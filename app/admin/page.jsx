"use client";

import { useEffect, useState } from "react";
import getSupabase from "../../lib/supabaseClient";
import { Loader2, Trash2, Users, Briefcase, FileText, Eye, X } from "lucide-react";
import "./AdminDashboard.css"; 

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


  const fetchAll = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: jobs }, { data: applications }] =
      await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("jobs").select("*"),
        supabase.from("applications").select("*"),
      ]);

    setUsers(profiles || []);
    setJobs(jobs || []);
    setApplications(applications || []);

    setStats({
      users: profiles?.length || 0,
      applicants: profiles?.filter(u => u.role === "applicant").length || 0,
      employers: profiles?.filter(u => u.role === "employer").length || 0,
      jobs: jobs?.length || 0,
      applications: applications?.length || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);


  const deleteRow = async (table, id) => {
    if (!confirm("Are you sure?")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) fetchAll();
    else alert(error.message);
  };


  const filteredUsers =
    userFilter === "all"
      ? users
      : users.filter(u => u.role === userFilter);


  const handleCardClick = label => {
    switch (label) {
      case "Users":
        setActiveTab("users");
        setUserFilter("all");
        break;
      case "Applicants":
        setActiveTab("users");
        setUserFilter("applicant");
        break;
      case "Employers":
        setActiveTab("users");
        setUserFilter("employer");
        break;
      case "Jobs":
        setActiveTab("jobs");
        break;
      case "Applications":
        setActiveTab("applications");
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-bg">
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          Admin Dashboard
        </h1>

        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            ["Users", stats.users, Users],
            ["Applicants", stats.applicants, Users],
            ["Employers", stats.employers, Users],
            ["Jobs", stats.jobs, Briefcase],
            ["Applications", stats.applications, FileText],
          ].map(([label, value, Icon], idx) => (
            <div
              key={label}
              onClick={() => handleCardClick(label)}
              className={`card cursor-pointer ${
                idx % 2 === 0 ? "bg-purple-light" : "bg-purple-dark"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="card-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-purple-text">{label}</p>
                  <p className="text-2xl md:text-3xl font-bold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="flex gap-3 mb-6">
          {[
            ["users", Users],
            ["jobs", Briefcase],
            ["applications", FileText],
          ].map(([tab, Icon]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${
                activeTab === tab ? "active" : ""
              }`}
            >
              <Icon size={18} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {}
        <div className="card p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-purple-accent" size={32} />
            </div>
          ) : (
            <>
              {}
              {activeTab === "users" && (
                <Table
                  headers={["Name", "Role", "Joined", "Actions"]}
                  rows={filteredUsers.map(u => [
                    u.name || "—",
                    u.role,
                    new Date(u.created_at).toLocaleDateString(),
                    deleteAction(() => deleteRow("profiles", u.id)),
                  ])}
                />
              )}

              {}
              {activeTab === "jobs" && (
                <Table
                  headers={["Title", "Company", "Paid", "Actions"]}
                  rows={jobs.map(j => [
                    j.title,
                    j.company_name || "—",
                    j.paid ? "Yes" : "No",
                    jobActions(
                      () => setSelectedJob(j),
                      () => deleteRow("jobs", j.id)
                    ),
                  ])}
                />
              )}

              {}
              {activeTab === "applications" && (
                <Table
                  headers={["Job", "Applicant", "Status"]}
                  rows={applications.map(a => {
                    const job = jobs.find(j => j.id === a.job_id);
                    const applicant = users.find(u => u.id === a.applicant_id);
                    return [
                      job?.title || "—",
                      applicant?.name || "—",
                      a.status,
                    ];
                  })}
                />
              )}
            </>
          )}
        </div>
      </div>

      {}
      {selectedJob && (
        <div className="modal-bg">
          <div className="modal-card">
            <button
              onClick={() => setSelectedJob(null)}
              className="modal-close"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-purple-dark">
              {selectedJob.title}
            </h2>

            <div className="space-y-2 text-sm text-purple-dark">
              <p><b>Company:</b> {selectedJob.company_name}</p>
              <p><b>Description:</b> {selectedJob.description}</p>
              <p><b>Requirements:</b> {selectedJob.requirements}</p>
              <p><b>Salary:</b> {selectedJob.salary || "—"}</p>
              <p><b>Type:</b> {selectedJob.type}</p>
              <p><b>Location:</b> {selectedJob.location}</p>
              <p><b>Paid:</b> {selectedJob.paid ? "Yes" : "No"}</p>
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
          {headers.map(h => (
            <th key={h} className="p-4 border-b text-sm font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={`table-row ${i % 2 === 0 ? "even" : "odd"}`}>
            {row.map((cell, j) => (
              <td key={j} className="p-4 text-sm">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const deleteAction = del => (
  <button className="button-delete" onClick={del}>
    <Trash2 size={16} />
    Delete
  </button>
);

const jobActions = (view, del) => (
  <div className="flex gap-3">
    <button className="button-primary" onClick={view}>
      <Eye size={14} /> View
    </button>
    <button className="button-delete" onClick={del}>
      <Trash2 size={14} /> Delete
    </button>
  </div>
);
