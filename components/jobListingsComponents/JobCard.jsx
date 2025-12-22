"use client";

import { useState } from "react";

export default function JobCard({ job }) {
  const [bookmarked, setBookmarked] = useState(false);

  async function toggleBookmark() {
    const res = await fetch("/api/bookmark", {
      method: "POST",
      body: JSON.stringify({ jobId: job.id }),
    });

    const data = await res.json();
    setBookmarked(data.bookmarked);
  }

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">

      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <button onClick={toggleBookmark}>
          {bookmarked ? "⭐" : "☆"}
        </button>
      </div>

      <p className="text-sm text-gray-600">{job.location}</p>

      <p className="text-sm text-gray-500">
        {job.type} · {job.paid ? "Paid" : "Unpaid"}
      </p>

      <p className="text-sm text-gray-700 line-clamp-3">
        {job.description}
      </p>

      <div className="flex justify-between text-sm text-gray-500 pt-2">
        <span>Salary: {job.salary ? `$${job.salary}` : "Negotiable"}</span>
        <span>{new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
