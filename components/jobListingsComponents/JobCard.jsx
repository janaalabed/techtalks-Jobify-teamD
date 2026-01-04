
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Bookmark, MapPin, Clock, DollarSign, Calendar, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import getSupabase from "../../lib/supabaseClient";
import ApplyJobModal from "./ApplyJobModal";

export default function JobCard({ job, bookmarked, onToggleBookmark }) {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function toggleBookmark(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Login to save jobs"); return; }
      const { data: existing } = await supabase.from("bookmarks").select("id").eq("user_id", user.id).eq("job_id", job.id).maybeSingle();
      if (existing) {
        await supabase.from("bookmarks").delete().eq("id", existing.id);
        toast("Removed from bookmarks", { icon: "🗑️" });
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, job_id: job.id });
        toast.success("Job Saved");
      }
      if (onToggleBookmark) onToggleBookmark(job.id);
    } catch (err) {
      toast.error("Error toggling bookmark");
    } finally {
      setLoading(false);
    }
  }

return (
  <>
    <div 
      className="group relative bg-white border border-slate-200/80 rounded-[2rem] p-5 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3e3875]/10 hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 group-hover:h-1/2 bg-[#3e3875] rounded-r-full transition-all duration-300" />

      <div className="flex flex-col gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black text-[#170e2c] group-hover:text-[#5f5aa7] transition-colors leading-tight">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <MapPin size={14} className="text-[#7270b1]" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <Clock size={14} className="text-[#7270b1]" /> {job.type}
                </span>
              </div>
            </div>

            <button
              onClick={toggleBookmark}
              disabled={loading}
              className={`p-3 rounded-2xl transition-all shrink-0 ${
                bookmarked 
                  ? "bg-[#3e3875] text-white shadow-lg" 
                  : "bg-slate-50 text-slate-300 hover:text-[#5f5aa7] border border-transparent hover:border-slate-100"
              }`}
            >
              <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-4 mb-6">
            <p className={`text-slate-500 text-sm leading-relaxed transition-all duration-500 ${isExpanded ? "" : "line-clamp-2"}`}>
              {job.description}
            </p>
            {job.description?.length > 100 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-[#5f5aa7] text-[10px] font-black uppercase tracking-[0.1em] mt-3 hover:text-[#3e3875] flex items-center gap-1"
              >
                {isExpanded ? <>Show Less <ChevronUp size={14} /></> : <>Read More <ChevronDown size={14} /></>}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 border-t border-slate-50 gap-6">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-[#7270b1] uppercase tracking-widest">Compensation</span>
                <span className="text-[#170e2c] font-black text-sm md:text-base flex items-center gap-1 whitespace-nowrap">
                  {job.paid ? <><DollarSign size={16} className="text-emerald-500" />{job.salary || "Negotiable"}</> : <span className="text-slate-400">Voluntary</span>}
                </span>
              </div>
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-[#7270b1] uppercase tracking-widest">Posted</span>
                <span className="text-slate-500 font-bold text-sm whitespace-nowrap">
                  {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setShowApplyModal(true); }} 
              className="w-full sm:w-auto bg-[#3e3875] hover:bg-[#170e2c] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#3e3875]/10 flex items-center justify-center gap-2"
            >
              Apply Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {showApplyModal && <ApplyJobModal jobId={job.id} onClose={() => setShowApplyModal(false)} />}
  </>
);
}