"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/jobListingsComponents/NavBar";
import getSupabase from "../../lib/supabaseClient";
import { Briefcase, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";

export default function ApplicationsPage() {
  const supabase = getSupabase();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: applicant } = await supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!applicant) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/applications?applicantId=${applicant.id}`);
      const data = await res.json();
      setApplications(data);
      setLoading(false);
    };

    fetchApplications();
  }, [supabase]);

  if (loading) return (
    <div className="h-screen bg-[#f1f2f6] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5f5aa7]/20 border-t-[#5f5aa7] rounded-full animate-spin"></div>
      <p className="mt-4 text-[#7270b1] font-medium text-xs uppercase tracking-widest">Loading applications</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#edf0f7] font-sans antialiased text-[#170e2c]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
       
        <header className="mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#170e2c] tracking-tight mb-1 md:mb-2">
              My Applications
            </h1>
            <p className="text-[#7270b1] text-sm md:text-base font-medium">Keep track of your professional progress.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-[#3e3875]/10 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
            <span className="text-[10px] font-black uppercase text-[#7270b1] tracking-wider">Total: </span>
            <span className="text-sm font-bold text-[#3e3875]">{applications.length}</span>
          </div>
        </header>

        {applications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-10 md:p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#edf0f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-[#5f5aa7]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#3e3875]">No activity yet</h3>
            <p className="text-[#7270b1] text-sm mt-1">Your submitted applications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group bg-white hover:bg-[#fcfcff] p-4 md:p-5 rounded-2xl border border-[#3e3875]/5 shadow-[0_4px_20px_-4px_rgba(62,56,117,0.08)] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">

                  {/* Job Info */}
                  <div className="flex gap-4 md:gap-5 items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#edf0f7] rounded-xl flex items-center justify-center text-[#5f5aa7] font-black text-lg md:text-xl shrink-0 group-hover:bg-[#3e3875] group-hover:text-white transition-all duration-300">
                      {app.jobs?.title?.charAt(0)}
                    </div>
                    <div className="min-w-0"> 
                      <h3 className="text-base md:text-lg font-bold text-[#170e2c] leading-snug truncate">
                        {app.jobs?.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 md:gap-x-4 mt-1">
                        <span className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-[#7270b1]">
                          <MapPin size={13} className="opacity-70" /> {app.jobs?.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-[#7270b1]">
                          <Clock size={13} className="opacity-70" /> {app.jobs?.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-[#7270b1] whitespace-nowrap">
                          <Calendar size={13} className="opacity-70" />
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t border-slate-50 md:border-t-0 pt-4 md:pt-0">
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border shadow-sm ${app.status === "pending" ? "text-amber-600 bg-amber-50 border-amber-100" :
                          app.status === "accepted" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                            app.status === "rejected" ? "text-rose-600 bg-rose-50 border-rose-100" :
                              "text-[#7270b1] bg-slate-50 border-slate-100"
                        }`}>
                        {app.status}
                      </span>

                      {/* Step Progress Bar */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-1 w-5 md:w-6 rounded-full transition-colors duration-500 ${app.status === 'accepted' ? 'bg-emerald-400' :
                                app.status === 'rejected' ? 'bg-rose-400' :
                                  step === 1 ? 'bg-[#5f5aa7]' : 'bg-[#edf0f7]'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}