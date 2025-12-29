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

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Header Section */}
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-[#170e2c] tracking-tight mb-2">Saved Jobs</h1>
                        <p className="text-[#7270b1] font-medium">Your curated list of potential opportunities.</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm border border-[#3e3875]/10 px-4 py-2 rounded-xl shadow-sm">
                        <span className="text-[10px] font-black uppercase text-[#7270b1] tracking-wider">Bookmarks: </span>
                        <span className="text-sm font-bold text-[#3e3875]">{savedJobs.length}</span>
                    </div>
                </header>

                {savedJobs.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-20 text-center shadow-sm">
                        <div className="w-16 h-16 bg-[#edf0f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bookmark className="text-[#7270b1]" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#3e3875]">No bookmarks found</h3>
                        <p className="text-[#7270b1] text-sm mt-1">Jobs you save will appear here for easy access.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="transition-transform duration-200 hover:scale-[1.01]">
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