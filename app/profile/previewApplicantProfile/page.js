"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const { data: applicantData, error: applicantError } = await supabase
          .from("applicants")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (applicantError && applicantError.code !== 'PGRST116') throw applicantError;

        // Parse JSON strings if necessary
        const parsedApplicant = applicantData ? {
          ...applicantData,
          skills: typeof applicantData.skills === 'string' ? JSON.parse(applicantData.skills) : applicantData.skills,
          education: typeof applicantData.education === 'string' ? JSON.parse(applicantData.education) : applicantData.education,
          experience: typeof applicantData.experience === 'string' ? JSON.parse(applicantData.experience) : applicantData.experience,
        } : {};

        setProfile({ ...profileData, email: user.email });
        setApplicant(parsedApplicant);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... keep logic ...

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Sidebar: Profile Card */}
          <aside className="lg:col-span-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
              {/* Profile Header in Card */}
              <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center bg-white">
                <div className="relative mb-4 h-32 w-32">
                   {applicant?.photo_url ? (
                    <img
                      src={applicant.photo_url}
                      alt={profile?.name}
                      className="h-full w-full rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-4 ring-white">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900">{profile?.name || "Your Name"}</h1>
                <p className="text-sm font-medium text-blue-600">{applicant?.title || "Job Seeker"}</p>
                
                <div className="mt-6 flex w-full gap-3">
                  <button
                    onClick={() => router.push("/applicant/profile")}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100"></div>

              {/* Contact Info */}
              <div className="px-6 py-6 space-y-4">
                 <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                       </svg>
                    </div>
                    <span>{profile?.email}</span>
                 </div>
                 
                 {/* CV Download */}
                 <div className="pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Resume</p>
                     {applicant?.cv_url ? (
                      <a
                        href={applicant.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        Download CV
                      </a>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
                        No CV uploaded
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Section */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
               <div className="border-b border-slate-100 px-8 py-5">
                 <h2 className="text-lg font-bold text-slate-900">About Me</h2>
               </div>
               <div className="px-8 py-6">
                 {applicant?.bio ? (
                    <p className="text-base leading-relaxed text-slate-600">{applicant.bio}</p>
                 ) : (
                    <p className="text-sm italic text-slate-400">Write a short bio to introduce yourself to employers...</p>
                 )}
               </div>
            </section>

            {/* Skills Section */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
               <div className="border-b border-slate-100 px-8 py-5">
                 <h2 className="text-lg font-bold text-slate-900">Skills</h2>
               </div>
               <div className="px-8 py-6">
                 {Array.isArray(applicant?.skills) && applicant.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-500/10 hover:bg-slate-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400">Add skills to highlight your expertise...</p>
                )}
               </div>
            </section>

            {/* Experience Section */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
               <div className="border-b border-slate-100 px-8 py-5 flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.25a3 3 0 013 3v1.5a3 3 0 01-3 3v.25a3 3 0 01-3 3h-3a3 3 0 01-3-3V5.25zm9.75 6.75v1.5a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5v-1.5h10.5z" clipRule="evenodd" />
                       <path d="M3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 3.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 19.5a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Work Experience</h2>
               </div>
               <div className="px-8 py-6 space-y-8">
                  {Array.isArray(applicant?.experience) && applicant.experience.length > 0 ? (
                      applicant.experience.map((exp, i) => (
                          <div key={exp?.id || i} className="relative pl-8 border-l-2 border-slate-100 last:border-0 hover:border-blue-200 transition-colors">
                              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-600 ring-4 ring-blue-50"></div>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                  <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{exp.year}</span>
                              </div>
                              <p className="text-sm font-medium text-blue-600 mb-2">{exp.company}</p>
                              <p className="text-sm leading-relaxed text-slate-600">{exp.description}</p>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-6">
                        <p className="text-sm italic text-slate-400">No experience added yet.</p>
                      </div>
                  )}
               </div>
            </section>

             {/* Education Section */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
               <div className="border-b border-slate-100 px-8 py-5 flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.182-.311a49.853 49.853 0 014.018-2.018 48.74 48.74 0 0110.081-3.328C22.25 6.008 22.25 5.518 21.78 5.23a61.1 61.1 0 00-9.48-3.083zM12.75 16.026c4.5.955 8.27 1.83 8.27 1.83a.75.75 0 01.03 1.46l-.348.067a50.316 50.316 0 00-8.627 0l-4.104-.79a.75.75 0 01-.607-.736V16.73c0-.146.097-.272.235-.31a49.69 49.69 0 018.152-1.66.75.75 0 011.096 1.266z" />
                       <path d="M14.288 15.86a.75.75 0 00-.776-.736A49.82 49.82 0 0012 15.2c-1.39 0-2.754.045-4.089.133a.75.75 0 00-.696.737v.938c0 .164.108.31.268.366l3.968.796a50.06 50.06 0 009.112 0l1.761-.352c.16-.056.269-.202.269-.366v-.938a.75.75 0 00-.671-.736 48.618 48.618 0 00-7.665-.366zM11.25 10c0 .414-.336.75-.75.75h-7.5a.75.75 0 01-.75-.75v-2.25a.75.75 0 01.75-.75h7.5c.414 0 .75.336.75.75V10zM11.25 15.75c0 .414-.336.75-.75.75h-7.5a.75.75 0 01-.75-.75v-2.25a.75.75 0 01.75-.75h7.5c.414 0 .75.336.75.75v2.25z" />
                    </svg>
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Education</h2>
               </div>
               <div className="px-8 py-6 space-y-6">
                  {Array.isArray(applicant?.education) && applicant.education.length > 0 ? (
                    applicant.education.map((edu, i) => (
                      <div
                        key={edu?.id || i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 text-base">{edu.school}</h3>
                          <p className="text-indigo-600 font-medium text-sm mt-0.5">{edu.degree}</p>
                        </div>
                        <span className="mt-2 sm:mt-0 text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                          {edu.year}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                        <p className="text-sm italic text-slate-400">No education details added yet.</p>
                    </div>
                  )}
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
