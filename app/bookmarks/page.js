"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobListingsComponents/JobCard";
import "./bookmarks.css";
import Link from "next/link";

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const res = await fetch("/api/bookmark");
            if (res.status === 401) {
                setError("Please log in to view bookmarks");
                setLoading(false);
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch bookmarks");
            const data = await res.json();
            setBookmarks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnbookmark = (jobId) => {
        setBookmarks((prev) => prev.filter((job) => job.id !== jobId));
    };

    if (loading) return <div className="bookmarks-container">Loading...</div>;
    if (error) return <div className="bookmarks-container">{error}</div>;

    return (
        <div className="bookmarks-container">
            <div className="bookmarks-header">
                <h1 className="bookmarks-title">Saved Jobs</h1>
                <p className="bookmarks-subtitle">Manage your bookmarked opportunities</p>
            </div>

            {bookmarks.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't saved any jobs yet.</p>
                    <Link href="/jobs" className="empty-state-link">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="bookmarks-grid">
                    {bookmarks.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            initialBookmarked={true}
                            onToggleBookmark={() => handleUnbookmark(job.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
