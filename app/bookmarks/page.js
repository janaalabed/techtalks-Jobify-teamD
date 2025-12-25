
"use client";

import { useEffect, useState } from "react";
import JobCard from "../../components/jobListingsComponents/JobCard";
import getSupabase from "../../lib/supabaseClient";
import Navbar from "../../components/jobListingsComponents/NavBar";
import { toast } from "react-hot-toast";

export default function SavedJobsPage() {
    const supabase = getSupabase();
    const [savedJobs, setSavedJobs] = useState([]);

    async function fetchSavedJobs() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("bookmarks")
                .select(`
          jobs (
            id,
            title,
            description,
            salary,
            type,
            paid,
            location,
            created_at
          )
        `)
                .eq("user_id", user.id);

            if (error) throw error;

            
            setSavedJobs(data.map((b) => b.jobs));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load saved jobs");
        }
    }

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleToggleBookmark = async (jobId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Delete bookmark
            await supabase.from("bookmarks").delete()
                .eq("user_id", user.id)
                .eq("job_id", jobId);

            // Remove from local state immediately
            setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
            toast("Job removed from bookmarks", { icon: "🗑️" });
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove bookmark");
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold">Saved Jobs</h1>

                {savedJobs.length === 0 && (
                    <p className="text-gray-500 text-center">No saved jobs yet</p>
                )}

                <div className="space-y-4">
                    {savedJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            bookmarked={true} 
                            onToggleBookmark={handleToggleBookmark}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
