"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import getSupabase from "../../lib/supabaseClient";

export default function JobCard({ job, bookmarked, onToggleBookmark }) {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);

  async function toggleBookmark() {
    if (loading) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to save jobs");
        return;
      }

      // Check if bookmark exists
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("bookmarks").delete().eq("id", existing.id);
        toast("Job removed from bookmarks", { icon: "🗑️" });
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, job_id: job.id });
        toast.success("Job saved to bookmarks ⭐");
      }

      // Notify parent to update state
      if (onToggleBookmark) onToggleBookmark(job.id);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <button
          onClick={toggleBookmark}
          disabled={loading}
          className="text-xl hover:scale-110 transition disabled:opacity-50"
        >
          {bookmarked ? "⭐" : "☆"}
        </button>
      </div>

      <p className="text-sm text-gray-600">{job.location}</p>
      <p className="text-sm text-gray-500">{job.type} · {job.paid ? "Paid" : "Unpaid"}</p>
      <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>

      <div className="flex justify-between text-sm text-gray-500 pt-2">
        <span>Salary: {job.salary ? `$${job.salary}` : "Negotiable"}</span>
        <span>{new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
