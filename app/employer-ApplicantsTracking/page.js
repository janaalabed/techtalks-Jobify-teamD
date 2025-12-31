'use client'

import { useState, useEffect } from 'react'
import getSupabase from "../../lib/supabaseClient";
import Navbar from "../../components/companyDashboardComponents/NavBar";
import ApplicantCard from "../../components/ApplicantsTrackingPageComponents/ApplicantCard";
import ApplicantModal from "../../components/ApplicantsTrackingPageComponents/ApplicantReviewModal";

export default function ApplicantsBoard() {
    const supabase = getSupabase()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState(null)
    const columns = ['pending', 'reviewed', 'accepted', 'rejected'];

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data: employer } = await supabase.from('employers').select('id').eq('user_id', session.user.id).single();
            if (!employer) return;

            const { data, error } = await supabase.from('applications').select(`
                id, status, cv_url, cover_letter, applied_at, 
                jobs!inner ( id, title, employer_id ),
                applicants ( id, user_id, skills, experience, education, profiles ( name ) )
            `).eq('jobs.employer_id', employer.id).order('applied_at', { ascending: false });

            if (error) throw error;



            const formattedData = data.map(app => {
                if (app.cv_url && !app.cv_url.startsWith('http')) {
                    const { data: publicUrlData } = supabase
                        .storage
                        .from('applicant-assets')
                        .getPublicUrl(app.cv_url);

                    return { ...app, cv_url: publicUrlData.publicUrl };
                }
                return app;
            });

            setApplications(formattedData || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };


    const updateStatus = async (applicationId, newStatus, applicantUserId) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', applicationId);

            if (error) throw error;


            setApplications(prev =>
                prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
            );


            if (selectedApp?.id === applicationId) {
                setSelectedApp(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    if (loading) return (
        <div className="h-screen bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#f6f7ff] border-t-[#3e3875] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#7270b1] font-medium tracking-widest text-xs uppercase">Loading Talent Board</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#edf0f7] font-sans antialiased text-[#170e2c]">
            <Navbar />

            <header className="px-4 md:px-10 pt-6 md:pt-10 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#7270b1]/5">
                    <div className="w-2 h-2 rounded-full bg-[#5f5aa7] animate-pulse"></div>
                    <span className="text-[10px] md:text-xs font-bold text-[#3e3875] uppercase tracking-wider">
                        {applications.length} Total Applicants
                    </span>
                </div>
            </header>

            {/* Changed overflow-x-auto to flex-col on mobile, flex-row on desktop */}
            <main className="px-4 md:px-10 pb-10 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-start overflow-x-auto scrollbar-hide">
                {columns.map((col) => (
                    <section key={col} className="w-full md:min-w-[340px] md:max-w-[340px] flex flex-col bg-[#e0e2ff]/40 p-4 md:p-5 rounded-2xl border border-white/50">
                        <div className="flex items-center justify-between mb-5 px-1">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#3e3875] opacity-80">
                                {col === 'pending' ? 'New Entry' : col}
                            </h2>
                            <span className="text-[10px] font-mono font-bold bg-white text-[#5f5aa7] px-2 py-0.5 rounded-lg shadow-sm">
                                {applications.filter(a => (a.status || 'pending') === col).length}
                            </span>
                        </div>

                        <div className="space-y-4 custom-scrollbar">
                            {applications.filter(app => (app.status || 'pending') === col).length > 0 ? (
                                applications.filter(app => (app.status || 'pending') === col).map(app => (
                                    <ApplicantCard
                                        key={app.id}
                                        app={app}
                                        onReview={() => {
                                            if (app.status === 'pending') updateStatus(app.id, 'reviewed', app.applicants.user_id);
                                            setSelectedApp(app);
                                        }}
                                        onAccept={() => updateStatus(app.id, 'accepted', app.applicants.user_id)}
                                        onReject={() => updateStatus(app.id, 'rejected', app.applicants.user_id)}
                                    />
                                ))
                            ) : (
                                <div className="border-2 border-dashed border-[#7270b1]/10 rounded-2xl py-8 flex flex-col items-center justify-center opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#7270b1]">Empty Stage</p>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </main>

            {selectedApp && (
                <ApplicantModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </div>
    );
}