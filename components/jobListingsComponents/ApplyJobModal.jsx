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
     
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Login required");
        return;
      }

     
      const { data: applicant, error: applicantError } = await supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (applicantError || !applicant) {
        throw new Error("Applicant profile not found");
      }

      
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

      
      const fileExt = cvFile.name.split(".").pop();
      const filePath = `cvs/${applicant.id}/${jobId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("applicant-assets") 
      
        .upload(filePath, cvFile);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("applicant-assets")
        .getPublicUrl(filePath);

      
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
  <div className="fixed inset-0 z-[150] bg-[#170e2c]/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 md:p-8 relative shadow-2xl max-h-[95vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-slate-400 hover:text-[#170e2c] transition-colors"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-black text-[#170e2c] mb-6 tracking-tight">
        Apply for Position
      </h2>

      <div className="space-y-6">
        {/* CV Upload */}
        <div className="block">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Upload CV (PDF/DOC)
          </span>
          <div className="mt-2 p-4 border-2 border-dashed border-slate-100 rounded-2xl hover:border-[#5f5aa7]/30 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#5f5aa7]/10 file:text-[#3e3875] hover:file:bg-[#5f5aa7]/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div className="block">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Cover Letter
          </span>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="mt-2 w-full border border-slate-100 bg-slate-50 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#5f5aa7]/5 focus:border-[#5f5aa7]/20 transition-all resize-none"
            placeholder="Tell the employer why you're a great fit..."
          />
        </div>

        <button
          onClick={submitApplication}
          disabled={loading}
          className="w-full bg-[#3e3875] hover:bg-[#170e2c] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#3e3875]/20 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Send Application"}
        </button>
      </div>
    </div>
  </div>
);
}
