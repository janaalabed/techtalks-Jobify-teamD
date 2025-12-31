"use client";

import { useEffect, useState } from "react";
import JobCard from "../../components/jobListingsComponents/JobCard";
import getSupabase from "../../lib/supabaseClient";
import Navbar from "../../components/jobListingsComponents/NavBar";
import { toast } from "react-hot-toast";
import { Bookmark } from "lucide-react";

export default function SavedJobsPage() {
    const supabase = getSupabase();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchSavedJobs() {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleToggleBookmark = async (jobId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from("bookmarks").delete()
                .eq("user_id", user.id)
                .eq("job_id", jobId);

            setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
            toast("Job removed from bookmarks", { icon: "🗑️" });
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove bookmark");
        }
    };

    if (loading) return (
        <div className="h-screen bg-[#edf0f7] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#5f5aa7]/20 border-t-[#5f5aa7] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#edf0f7] font-sans antialiased text-[#170e2c]">
            <Navbar />

            {/* px-4 for mobile, px-6 for desktop. Adjusted py for mobile. */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">

                {/* Header Section: flex-col on mobile, items-start instead of end for better text flow */}
                <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#170e2c] tracking-tight mb-1 md:mb-2">
                            Saved Jobs
                        </h1>
                        <p className="text-[#7270b1] text-sm md:text-base font-medium">
                            Your curated list of potential opportunities.
                        </p>
                    </div>

                    {/* Bookmark counter: stays consistent size, self-start on mobile */}
                    <div className="bg-white/60 backdrop-blur-sm border border-[#3e3875]/10 px-4 py-2 rounded-xl shadow-sm self-start md:self-auto">
                        <span className="text-[10px] font-black uppercase text-[#7270b1] tracking-wider">Bookmarks: </span>
                        <span className="text-sm font-bold text-[#3e3875]">{savedJobs.length}</span>
                    </div>
                </header>

                {savedJobs.length === 0 ? (
                    /* Reduced p-20 (80px) to p-10 (40px) on mobile so it fits the screen */
                    <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-10 md:p-20 text-center shadow-sm">
                        <div className="w-16 h-16 bg-[#edf0f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bookmark className="text-[#7270b1]" size={32} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-[#3e3875]">No bookmarks found</h3>
                        <p className="text-[#7270b1] text-sm mt-1">Jobs you save will appear here for easy access.</p>
                    </div>
                ) : (
                    /* Space-y-4 is good, but added hover:scale-[1.005] for a subtler effect on smaller screens */
                    <div className="space-y-4 md:space-y-6">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="transition-transform duration-200 hover:scale-[1.005] active:scale-[0.99]">
                                <JobCard
                                    job={job}
                                    bookmarked={true}
                                    onToggleBookmark={handleToggleBookmark}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}