"use client";
 
import React, { useEffect, useState } from "react";
 
function badgeClass(status) {
  if (status === "accepted") return "bg-[#10B981]/10 text-[#10B981]";
  if (status === "rejected") return "bg-[#EF4444]/10 text-[#EF4444]";
  return "bg-[#F5F5F5] text-[#1A1A1A]";
}
 
export default function CompanyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
 
  async function load() {
    setLoading(true);
    const res = await fetch("/api/company/applications");
    const data = res.ok ? await res.json() : [];
    setApps(Array.isArray(data) ? data : []);
    setLoading(false);
  }
 
  useEffect(() => {
    load();
  }, []);
 
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Applications</h1>
          <a href="/dashboard" className="text-sm text-[#0A66C2] hover:underline">
            Back to dashboard
          </a>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : apps.length === 0 ? (
            <p className="text-sm text-gray-500">
              No applications yet. Once candidates apply, they’ll appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {apps.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-[#E5E7EB] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{a.applicant_name}</p>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${badgeClass(a.status)}`}>
                        {a.status || "pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {a.job_title ? `For: ${a.job_title}` : "Job: —"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                    </p>
                  </div>
 
                  <div className="flex gap-2">
                    {a.cv_url && (
                      <a
                        href={a.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-medium hover:bg-[#F5F5F5]"
                      >
                        View CV
                      </a>
                    )}
                    <button
                      className="rounded-md bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-medium hover:bg-[#F5F5F5]"
                      onClick={() => alert("Accept/Reject API comes next")}
                    >
                      Accept
                    </button>
                    <button
                      className="rounded-md bg-transparent px-3 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#F5F5F5]"
                      onClick={() => alert("Accept/Reject API comes next")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 