
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Bookmark, MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import getSupabase from "../../lib/supabaseClient";

export default function JobCard({ job, bookmarked, onToggleBookmark }) {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);

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
        toast.success("Job Saved ");
      }
      if (onToggleBookmark) onToggleBookmark(job.id);
    } catch (err) {
      toast.error("Error toggling bookmark");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-[#5f5aa7]/40 transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3e3875] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />

      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-[#170e2c] truncate pr-4">
              {job.title}
            </h3>
            
            <button
              onClick={toggleBookmark}
              disabled={loading}
              className={`shrink-0 transition-colors ${
                bookmarked ? "text-[#3e3875]" : "text-slate-300 hover:text-[#5f5aa7]"
              }`}
            >
              <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <MapPin size={14} className="text-[#7270b1]" /> {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <Clock size={14} className="text-[#7270b1]" /> {job.type}
            </div>
            {job.paid && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                Paid
              </span>
            )}
          </div>

          <p className="text-slate-500 text-sm line-clamp-1 mb-4">
            {job.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-[#7270b1] uppercase tracking-tighter">Salary Range</span>
                <span className="text-[#170e2c] font-bold text-sm">
                  {job.salary ? `$${job.salary}` : "Negotiable"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-[#7270b1] uppercase tracking-tighter">Posted Date</span>
                <span className="text-slate-500 font-bold text-sm">
                   {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}