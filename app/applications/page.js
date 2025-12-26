"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/jobListingsComponents/NavBar";
import getSupabase from "../../lib/supabaseClient";

export default function ApplicationsPage() {
  const supabase = getSupabase();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      //  Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      //  Get applicant id
      const { data: applicant } = await supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!applicant) return;

      //  Fetch applications using applicant ID
      const res = await fetch(`/api/applications?applicantId=${applicant.id}`);
      const data = await res.json();
      setApplications(data);
      setLoading(false);
    };

    fetchApplications();
  }, [supabase]);

  if (loading) return <p>Loading applications...</p>;

  if (applications.length === 0)
    return <p>You have not applied to any jobs yet.</p>;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-xl font-bold mb-6">My Applications</h1>
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
              <div>
                <p className="font-bold">{app.jobs?.title}</p>
                <p className="text-sm text-slate-500">{app.jobs?.location} | {app.jobs?.type}</p>
              </div>
              <div className="text-sm font-semibold">
                <span
                  className={`px-3 py-1 rounded-full ${app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      app.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                        app.status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {app.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
