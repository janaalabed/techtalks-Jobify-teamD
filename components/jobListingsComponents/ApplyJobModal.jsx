"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import getSupabase from "../../lib/supabaseClient";

export default function ApplyJobModal({ jobId, onClose }) {
  const supabase = getSupabase();
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitApplication() {
    if (!cvFile) {
      toast.error("Please upload your CV");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Login required");
        return;
      }

      // 2️⃣ Get applicant ID
      const { data: applicant, error: applicantError } = await supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (applicantError || !applicant) {
        throw new Error("Applicant profile not found");
      }

      // 3️⃣ Prevent duplicate application
      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("applicant_id", applicant.id)
        .maybeSingle();

      if (existing) {
        toast.error("You already applied for this job");
        setLoading(false);
        return;
      }

      // 4️⃣ Upload CV to Supabase Storage
      const fileExt = cvFile.name.split(".").pop();
      const filePath = `cvs/${applicant.id}/${jobId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("applicant-assets") // ✅ CORRECT BUCKET
        .upload(filePath, cvFile);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("applicant-assets")
        .getPublicUrl(filePath);

      // 5️⃣ Insert application record
      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          applicant_id: applicant.id,
          cv_url: publicData.publicUrl,
          cover_letter: coverLetter,
          status: "pending",
          applied_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      toast.success("Application submitted successfully");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-[#170e2c] mb-4">
          Apply for this job
        </h2>

        {/* CV Upload */}
        <label className="block mb-4">
          <span className="text-xs font-bold text-slate-600 uppercase">
            Upload CV
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="mt-2 block w-full text-sm"
          />
        </label>

        {/* Cover Letter */}
        <label className="block mb-6">
          <span className="text-xs font-bold text-slate-600 uppercase">
            Cover Letter
          </span>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="mt-2 w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#5f5aa7]/20"
            placeholder="Write a short cover letter..."
          />
        </label>

        <button
          onClick={submitApplication}
          disabled={loading}
          className="w-full bg-[#3e3875] hover:bg-[#170e2c] text-white py-3 rounded-xl font-bold text-sm transition"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
