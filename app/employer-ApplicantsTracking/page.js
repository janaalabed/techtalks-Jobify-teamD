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
            setApplications(data || []);
        } catch (error) { console.error('Fetch error:', error); } finally { setLoading(false); }
    };

    const updateStatus = async (applicationId, newStatus, applicantUserId) => {
        const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', applicationId);
        if (error) return;
        setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app));
        if (selectedApp?.id === applicationId) setSelectedApp(prev => ({ ...prev, status: newStatus }));
    };

    if (loading) return (
        <div className="h-screen bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#f6f7ff] border-t-[#3e3875] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#7270b1] font-medium tracking-widest text-xs uppercase">Loading Talent Board</p>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-[#fcfcff] font-sans antialiased text-[#170e2c]">
            <Navbar />

            {/* Sub-Header */}
            <header className="px-10 pt-10 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#7270b1]/5">
                    <div className="w-2 h-2 rounded-full bg-[#5f5aa7]"></div>
                    <span className="text-xs font-bold text-[#3e3875] uppercase tracking-wider">
                        {applications.length} Total Applicants
                    </span>
                </div>
            </header>

            {/* Board Layout */}
            <main className="px-10 pb-10 flex-1 flex overflow-x-auto gap-8 items-start scrollbar-hide">
                {columns.map((col) => (
                    
                    <section key={col} className="min-w-[340px] max-w-[340px] h-full flex flex-col bg-[#e0e2ff]/50 p-5 rounded-[0.5rem] border border-[#f1f2ff]">

                        {/* Cleaner Column Header */}
                        <div className="flex items-center justify-between mb-6 group px-1">
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#3e3875] opacity-80 group-hover:opacity-100 transition-opacity">
                                    {col === 'pending' ? 'New Entry' : col}
                                </h2>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-white text-[#5f5aa7] px-2 py-0.5 rounded-lg shadow-sm">
                                {applications.filter(a => (a.status || 'pending') === col).length.toString()}
                            </span>
                        </div>

                        {/* Column Content Area */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar hover:scrollbar-thumb-[#7270b1]/20 transition-colors">
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
                                <div className="border-2 border-dashed border-[#7270b1]/10 rounded-2xl py-12 flex flex-col items-center justify-center opacity-40">
                                    <div className="w-8 h-8 rounded-full bg-white mb-2"></div>
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

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: transparent; 
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #e2e4ff;
                }
            `}</style>
        </div>
    );
}