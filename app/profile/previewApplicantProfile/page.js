"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, MapPin, Briefcase, GraduationCap,
  User, Award, Edit3, ChevronRight
} from "lucide-react";
import getSupabase from "../../../lib/supabaseClient";
import Navbar from "../../../components/jobListingsComponents/NavBar";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const { data: applicantData } = await supabase
          .from("applicants")
          .select("*")
          .eq("user_id", user.id)
          .single();

        const parsedApplicant = applicantData ? {
          ...applicantData,
          skills: typeof applicantData.skills === 'string' ? JSON.parse(applicantData.skills) : applicantData.skills,
          education: typeof applicantData.education === 'string' ? JSON.parse(applicantData.education) : applicantData.education,
          experience: typeof applicantData.experience === 'string' ? JSON.parse(applicantData.experience) : applicantData.experience,
        } : {};

        setProfile({ ...profileData, email: user.email });
        setApplicant(parsedApplicant);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf0f7] ">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#7270b1]/20 border-t-[#5f5aa7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />


      <div className="relative h-48 md:h-64 w-full bg-[#170e2c] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3e3875] to-[#170e2c] opacity-90" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#5f5aa7 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>


      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">


          <aside className="lg:col-span-4">
            <div className="overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-2xl shadow-[#170e2c]/10 border border-slate-200">
              <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center">

                <div className="relative mb-6 h-32 w-32 md:h-36 md:w-36 group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3e3875] to-[#5f5aa7] animate-pulse opacity-20 group-hover:opacity-40 transition-opacity" />
                  {applicant?.photo_url ? (
                    <img
                      src={applicant.photo_url}
                      alt={profile?.name}
                      className="relative h-full w-full rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-[#7270b1] border-4 border-white shadow-xl">
                      <User size={48} className="md:size-16" />
                    </div>
                  )}
                </div>

                <h1 className="text-xl md:text-2xl font-black text-[#170e2c]">{profile?.name || "Your Name"}</h1>
                <p className="text-[#5f5aa7] font-bold text-[10px] md:text-xs tracking-widest uppercase mt-2">
                  {applicant?.title || "Applicant"}
                </p>

                <div className="mt-8 flex w-full flex-col gap-3">
                  <button
                    onClick={() => router.push("/applicant/profile")}
                    className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#3e3875] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#3e3875]/20 hover:bg-[#170e2c] transition-all active:scale-95"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>


              <div className="px-6 md:px-8 pb-10 space-y-5 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-4 text-sm text-[#3e3875] font-semibold p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                    <Mail size={18} className="text-[#5f5aa7]" />
                  </div>
                  <span className="truncate md:break-all">{profile?.email}</span>
                </div>
              </div>
            </div>
          </aside>


          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-[#170e2c]/5 border border-slate-100 p-6 md:p-12 space-y-10 md:space-y-12">


              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 md:h-10 w-1 bg-[#5f5aa7] rounded-full" />
                  <h2 className="text-lg md:text-xl font-black text-[#170e2c]">Professional Summary</h2>
                </div>
                <div className="text-slate-600 leading-relaxed text-base md:text-lg italic">
                  {applicant?.bio ? `"${applicant.bio}"` : "No summary provided yet."}
                </div>
              </section>

              <hr className="border-slate-50" />


              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 md:h-10 w-1 bg-[#5f5aa7] rounded-full" />
                  <h2 className="text-lg md:text-xl font-black text-[#170e2c]">Expertise & Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {Array.isArray(applicant?.skills) && applicant.skills.length > 0 ? (
                    applicant.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-[#f1f0fb] text-[#3e3875] text-xs md:text-sm font-bold border border-[#3e3875]/5">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">Skills list is empty.</p>
                  )}
                </div>
              </section>

              <hr className="border-slate-50" />


              <section>
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 md:h-10 w-1 bg-[#5f5aa7] rounded-full" />
                    <h2 className="text-lg md:text-xl font-black text-[#170e2c]">Work History</h2>
                  </div>
                  <Briefcase className="hidden sm:block text-slate-200" size={32} />
                </div>

                <div className="space-y-8 md:space-y-10">
                  {Array.isArray(applicant?.experience) && applicant.experience.length > 0 ? (
                    applicant.experience.map((exp, i) => (
                      <div key={i} className="group relative pl-8 md:pl-10">
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-slate-100 group-last:h-2" />
                        <div className="absolute left-[-5px] top-2 h-3 w-3 rounded-full bg-[#5f5aa7] ring-4 ring-white" />

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-[#170e2c] group-hover:text-[#5f5aa7] transition-colors">{exp.role}</h3>
                            <p className="text-[#7270b1] font-semibold text-sm">{exp.company}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#3e3875] px-3 py-1.5 rounded-lg shadow-sm">
                            {exp.year}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs md:text-sm mt-3">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 py-4 text-sm">No experience added.</p>
                  )}
                </div>
              </section>

              <hr className="border-slate-50" />


              <section>
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 md:h-10 w-1 bg-[#5f5aa7] rounded-full" />
                    <h2 className="text-lg md:text-xl font-black text-[#170e2c]">Education</h2>
                  </div>
                  <GraduationCap className="hidden sm:block text-slate-200" size={32} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {Array.isArray(applicant?.education) && applicant.education.length > 0 ? (
                    applicant.education.map((edu, i) => (
                      <div key={i} className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-[#5f5aa7]/20 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Award className="text-[#5f5aa7]" size={18} />
                          </div>
                          <span className="text-[10px] font-black text-[#7270b1] uppercase tracking-widest">{edu.year}</span>
                        </div>
                        <h3 className="font-bold text-[#170e2c] text-sm md:text-base leading-tight">{edu.school}</h3>
                        <p className="text-[#3e3875] font-medium text-xs md:text-sm mt-1">{edu.degree}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">No education history.</p>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}