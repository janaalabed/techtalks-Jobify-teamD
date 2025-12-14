"use client";
 
import { useEffect, useState } from "react";
 
const empty = {
  title: "",
  description: "",
  requirements: "",
  salary_min: "",
  salary_max: "",
  job_type: "onsite",
  contract_type: "full_time",
  is_paid: true,
  status: "open",
};
 
export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");
 
  async function load() {
    const res = await fetch("/api/company/jobs");
    const data = await res.json();
    if (res.ok) setJobs(data.jobs || []);
    else setMsg(data.error || "Error");
  }
 
  useEffect(() => { load(); }, []);
 
  async function createJob(e) {
    e.preventDefault();
    setMsg("");
    const payload = {
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
    };
    const res = await fetch("/api/company/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    setForm(empty);
    await load();
    setMsg("Job posted ✅");
  }
 
  async function del(jobId) {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/company/jobs/${jobId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    await load();
  }
 
  async function setStatus(jobId, status) {
    const job = jobs.find((j) => j.id === jobId);
    const res = await fetch(`/api/company/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...job, status }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    await load();
  }
 
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Jobs</h1>
        {msg && <span className="text-sm text-gray-300">{msg}</span>}
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-medium">Post a job</h2>
 
          <form onSubmit={createJob} className="mt-4 space-y-3">
            <Input label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
 
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description *</label>
              <textarea
                className="w-full min-h-28 rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-sm outline-none focus:border-zinc-600"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
 
            <div>
              <label className="block text-sm text-gray-300 mb-1">Requirements</label>
              <textarea
                className="w-full min-h-24 rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-sm outline-none focus:border-zinc-600"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Salary min" value={form.salary_min} onChange={(v) => setForm({ ...form, salary_min: v })} />
              <Input label="Salary max" value={form.salary_max} onChange={(v) => setForm({ ...form, salary_max: v })} />
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                label="Work mode"
                value={form.job_type}
                onChange={(v) => setForm({ ...form, job_type: v })}
                options={[
                  ["remote", "Remote"],
                  ["onsite", "On-site"],
                  ["hybrid", "Hybrid"],
                ]}
              />
              <Select
                label="Contract"
                value={form.contract_type}
                onChange={(v) => setForm({ ...form, contract_type: v })}
                options={[
                  ["internship", "Internship"],
                  ["full_time", "Full-time"],
                  ["part_time", "Part-time"],
                ]}
              />
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v })}
                options={[
                  ["open", "Open"],
                  ["filled", "Filled"],
                  ["closed", "Closed"],
                ]}
              />
            </div>
 
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={!!form.is_paid}
                onChange={(e) => setForm({ ...form, is_paid: e.target.checked })}
              />
              Paid (for internships)
            </label>
 
            <button className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:opacity-90">
              Publish
            </button>
          </form>
        </div>
 
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-medium">Your job posts</h2>
 
          <div className="mt-4 space-y-3">
            {jobs.length === 0 ? (
              <div className="text-sm text-gray-400">No jobs yet.</div>
            ) : (
              jobs.map((j) => (
                <div key={j.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {j.contract_type.replace("_", " ")} • {j.job_type} • {j.is_paid ? "paid" : "unpaid"} •{" "}
                        <span className="uppercase">{j.status}</span>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api_containers/company/applications_received?jobId=${j.id}`}
                        className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs hover:bg-zinc-800"
                      >
                        Applicants
                      </a>
                      <button
                        onClick={() => setStatus(j.id, j.status === "open" ? "filled" : "open")}
                        className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs hover:bg-zinc-800"
                      >
                        Toggle status
                      </button>
                      <button
                        onClick={() => del(j.id)}
                        className="px-3 py-1.5 rounded-xl border border-red-900/60 text-xs hover:bg-red-950"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-sm outline-none focus:border-zinc-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
 
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <select
        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-sm outline-none focus:border-zinc-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

 