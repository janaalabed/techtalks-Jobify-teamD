"use client";

import React, { useEffect, useState } from "react";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    website: "",
    location: "",
    logourl: "",
    description: "",
  });

  async function loadProfile() {
    setLoading(true);
    const res = await fetch("/app/companies/profile");
    const data = res.ok ? await res.json() : null;

    if (data) {
      setForm({
        name: data.name || "",
        website: data.website || "",
        location: data.location || "",
        logourl: data.logourl || "",
        description: data.description || "",
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function onChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("website", form.website);
    fd.append("location", form.location);
    fd.append("logourl", form.logourl);
    fd.append("description", form.description);

    const res = await fetch("/app/companies/profile", {
      method: "POST",
      body: fd,
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to save profile");
      return;
    }

    alert("Saved");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Company Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Logo URL</label>
                <input
                  name="logourl"
                  value={form.logourl}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm min-h-[100px]
                             focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  disabled={saving}
                  className="rounded-md bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white 
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] 
                             disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}