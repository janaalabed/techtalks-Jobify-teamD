"use client";

import React, { useState } from "react";

export default function NewJobPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    jobType: "onsite",
    roleType: "internship",
    paidStatus: "paid",
    salary: "",
    location: "",
  });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/company/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to publish job");
      return;
    }

    alert("Published ✅");
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Create Job Post</h1>

        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Job Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                required
                className="mt-1 w-full min-h-[120px] rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={onChange}
                className="mt-1 w-full min-h-[110px] rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Job Type</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                >
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Role Type</label>
                <select
                  name="roleType"
                  value={form.roleType}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                >
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Paid</label>
                <select
                  name="paidStatus"
                  value={form.paidStatus}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Salary (optional)</label>
                <input
                  name="salary"
                  value={form.salary}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <a
                href="/dashboard"
                className="rounded-md bg-white border border-[#E5E7EB] px-4 py-2 text-sm font-medium
                hover:bg-[#F5F5F5]"
              >
                Cancel
              </a>
              <button
                disabled={saving}
                className="rounded-md bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2
                disabled:opacity-60"
              >
                {saving ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
