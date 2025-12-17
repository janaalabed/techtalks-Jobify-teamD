"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const HARD_CODED_EMPLOYER_ID = 1;

export default function JobModal({ mode, jobId, onClose, onSuccess }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    requirements: "",
    type: "",
    paid: true,
    salary: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit); // only load when edit
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Close on ESC
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Load job when editing
  useEffect(() => {
    if (!isEdit || !jobId) return;

    async function loadJob() {
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("title, location, description, requirements, type, paid, salary")
        .eq("id", jobId)
        .eq("employer_id", HARD_CODED_EMPLOYER_ID)
        .single();

      if (error) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to load job",
        }));
        setLoading(false);
        return;
      }

      setForm({
        title: data.title || "",
        location: data.location || "",
        description: data.description || "",
        requirements: data.requirements || "",
        type: data.type || "",
        paid: data.paid ?? true,
        salary: data.salary || "",
      });

      setLoading(false);
    }

    loadJob();
  }, [isEdit, jobId]);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));

    setSubmitted(false);
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!form.type) newErrors.type = "Job type is required";

    if (form.paid && !form.salary.trim()) {
      newErrors.salary = "Salary is required for paid positions";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);

    const payload = {
      employer_id: HARD_CODED_EMPLOYER_ID,
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      salary: form.paid ? form.salary.trim() : null,
      type: form.type,
      paid: form.paid,
      location: form.location.trim(),
    };

    const query = isEdit
      ? supabase.from("jobs").update(payload).eq("id", jobId)
      : supabase.from("jobs").insert([payload]);

    const { error } = await query;

    setSaving(false);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save job. Please try again.",
      }));
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    onSuccess(); // closes modal + refresh jobs
  }

  function handleClear() {
    setForm({
      title: "",
      location: "",
      description: "",
      requirements: "",
      type: "",
      paid: true,
      salary: "",
    });
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay (blur + dark) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card (SAME STYLE AS YOUR FORM) */}
      <div className="relative w-full max-w-xl">
        <div className="w-full bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                {isEdit ? "Edit Job" : "Create Job"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Update the details of your job post."
                  : "Fill in the details to publish a new job."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 px-3 py-2 hover:bg-slate-50 transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-600">
              Loading job...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job Title */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700"
                >
                  Job Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="e.g. Frontend Developer"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-slate-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="e.g. Beirut, Remote"
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
                  placeholder="Briefly describe the role..."
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Requirements + Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requirements */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="requirements"
                    className="text-sm font-medium text-slate-700"
                  >
                    Requirements
                  </label>
                  <input
                    id="requirements"
                    name="requirements"
                    type="text"
                    value={form.requirements}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="e.g. 2+ years experience, React, Git"
                  />
                  {errors.requirements && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.requirements}
                    </p>
                  )}
                </div>

                {/* Job Type */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="type"
                    className="text-sm font-medium text-slate-700"
                  >
                    Job Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Select type</option>
                    <option value="full-time">Full-time</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                  {errors.type && (
                    <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Paid position */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="paid"
                  name="paid"
                  type="checkbox"
                  checked={form.paid}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="paid"
                  className="text-sm font-medium text-slate-700"
                >
                  Paid position
                </label>
              </div>

              {/* Salary (only when paid) */}
              {form.paid && (
                <div className="flex flex-col gap-1 mt-2">
                  <label
                    htmlFor="salary"
                    className="text-sm font-medium text-slate-700"
                  >
                    Salary
                  </label>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="e.g. $1200 / month"
                  />
                  {errors.salary && (
                    <p className="text-xs text-red-500 mt-1">{errors.salary}</p>
                  )}
                </div>
              )}

              {/* Submit messages */}
              {errors.submit && (
                <p className="text-sm text-red-500 text-center mt-1">
                  {errors.submit}
                </p>
              )}
              {submitted && !errors.submit && (
                <p className="text-sm text-green-600 text-center mt-1">
                  {isEdit ? "Job updated successfully." : "Job created successfully."}
                </p>
              )}

              {/* Buttons (same style) */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700 shadow-sm hover:shadow transition disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : isEdit
                    ? "Save Changes"
                    : "Create Job"}
                </button>

                {!isEdit && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 py-2.5 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 py-2.5 hover:bg-slate-50 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
