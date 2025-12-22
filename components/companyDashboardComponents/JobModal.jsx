"use client";

import { useEffect, useState } from "react";
import getSupabase from "../../lib/supabaseClient";

export default function JobModal({ mode, jobId, onClose, onSuccess }) {
  const supabase = getSupabase();
  const isEdit = mode === "edit";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    requirements: "",
    type: "",
    paid: true,
    salary: "",
  });

  /* 🔐 Get authenticated user */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        setError("You must be logged in");
        return;
      }
      setUser(data.user);
    };
    loadUser();
  }, [supabase]);

  /* 📄 Load job when editing */
  useEffect(() => {
    if (!isEdit || !jobId || !user) return;

    const loadJob = async () => {
      setLoading(true);
      setError("");

      const { data: employer } = await supabase
        .from("employers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!employer) {
        setError("Employer profile not found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("employer_id", employer.id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setForm({
        title: data.title ?? "",
        location: data.location ?? "",
        description: data.description ?? "",
        requirements: data.requirements ?? "",
        type: data.type ?? "",
        paid: data.paid ?? true,
        salary: data.salary ?? "",
      });

      setLoading(false);
    };

    loadJob();
  }, [isEdit, jobId, user, supabase]);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");

    const { data: employer } = await supabase
      .from("employers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!employer) {
      setError("You must create a company profile first.");
      setSaving(false);
      return;
    }

    const payload = {
      employer_id: employer.id,
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      location: form.location.trim(),
      type: form.type,
      paid: form.paid,
      salary: form.paid ? form.salary.trim() : null,
    };

    const query = isEdit
      ? supabase.from("jobs").update(payload).eq("id", jobId)
      : supabase.from("jobs").insert([payload]);

    const { error } = await query;
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    onSuccess();
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow">
          Loading job...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-5 shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Job" : "Create Job"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Inputs */}
       {/* Inputs */}
<div className="grid grid-cols-1 gap-4">
  <input
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    name="title"
    placeholder="Job title"
    value={form.title}
    onChange={handleChange}
    required
  />

  <input
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    name="location"
    placeholder="Location"
    value={form.location}
    onChange={handleChange}
    required
  />

  <textarea
    className="w-full border rounded-lg px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    name="description"
    placeholder="Job description"
    value={form.description}
    onChange={handleChange}
    required
  />

  <textarea
    className="w-full border rounded-lg px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    name="requirements"
    placeholder="Job requirements"
    value={form.requirements}
    onChange={handleChange}
    required
  />

  <select
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    name="type"
    value={form.type}
    onChange={handleChange}
    required
  >
    <option value="">Select job type</option>
    <option value="full-time">Full-time</option>
    <option value="part-time">Part-time</option>
    <option value="internship">Internship</option>
  </select>

  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      name="paid"
      checked={form.paid}
      onChange={handleChange}
    />
    <span className="text-sm">Paid position</span>
  </label>

  {form.paid && (
    <input
      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      name="salary"
      placeholder="Salary (e.g. 1000$)"
      value={form.salary}
      onChange={handleChange}
      required
    />
  )}
</div>


        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
