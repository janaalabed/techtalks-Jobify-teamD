"use client";
 
import { useEffect, useMemo, useState } from "react";
 
export default function ApplicationsReceivedPage() {
  const [job, setJob] = useState(null);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const jobId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("jobId");
  }, []);
 
  async function load() {
    setMsg("");
    if (!jobId) return setMsg("Missing jobId in URL");
    const res = await fetch(`/api/company/jobs/${jobId}/applications`);
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    setJob(data.job);
    setRows(data.applicants || []);
  }
 
  useEffect(() => { load(); }, [jobId]);
 
  async function setStatus(appId, status) {
    setMsg("");
    const res = await fetch(`/api/company/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    await load();
  }
 
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Applicants</h1>
          {job && <p className="text-sm text-gray-400 mt-1">Job: {job.title}</p>}
        </div>
        {msg && <span className="text-sm text-gray-300">{msg}</span>}
      </div>
 
      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950">
            <tr className="text-left text-gray-300">
              <th className="p-3">Applicant</th>
              <th className="p-3">Email</th>
              <th className="p-3">CV</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900/40">
            {rows.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan={5}>
                  No applications yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.application_id} className="border-t border-zinc-800">
                  <td className="p-3">{r.full_name}</td>
                  <td className="p-3 text-gray-300">{r.email}</td>
                  <td className="p-3">
                    {r.cv_url ? (
                      <a className="underline text-gray-200" href={r.cv_url} target="_blank">
                        Open CV
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3 uppercase text-xs text-gray-300">{r.status}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setStatus(r.application_id, "reviewed")}
                        className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs hover:bg-zinc-800"
                      >
                        Reviewed
                      </button>
                      <button
                        onClick={() => setStatus(r.application_id, "accepted")}
                        className="px-3 py-1.5 rounded-xl border border-emerald-900/60 text-xs hover:bg-emerald-950"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setStatus(r.application_id, "rejected")}
                        className="px-3 py-1.5 rounded-xl border border-red-900/60 text-xs hover:bg-red-950"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 