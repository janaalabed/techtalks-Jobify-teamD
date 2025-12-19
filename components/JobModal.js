"use client";

import { useEffect, useState } from "react";
import getSupabase from "../lib/supabaseClient";

const HARD_CODED_EMPLOYER_ID = 1;

export default function JobModal({ mode, jobId, onClose, onSuccess }) {
  const supabase = getSupabase();
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
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
  }, [isEdit, jobId, supabase]);

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
    onSuccess();
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl">
        <div className="w-full bg-white rounded-3xl shadow-xl p-8">
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
              {/* form content unchanged */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
