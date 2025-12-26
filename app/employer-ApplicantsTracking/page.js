'use client'

import { useState, useEffect } from 'react'
import getSupabase from "../../lib/supabaseClient";
import { X, Check, Eye, XCircle, FileText } from 'lucide-react'

export default function ApplicantsBoard() {
    const supabase = getSupabase()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState(null)

    // FIX: Match exact lowercase values allowed by your DB check constraint
    const columns = ['pending', 'reviewed', 'accepted', 'rejected'];

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data: employer, error: empError } = await supabase
                .from('employers')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (empError || !employer) return;

            const { data, error } = await supabase
                .from('applications')
                .select(`
                    id,
                    status,
                    cv_url,
                    cover_letter,
                    applied_at, 
                    jobs!inner ( id, title, employer_id ),
                    applicants (
                        id,
                        user_id,
                        skills,
                        experience,
                        education,
                        profiles ( name )
                    )
                `)
                .eq('jobs.employer_id', employer.id)
                .order('applied_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, newStatus, applicantUserId) => {
        try {
            // 1. Update DB (newStatus must be lowercase to pass check constraint)
            const { error: updateError } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', applicationId);

            if (updateError) {
                alert("Database Error: " + updateError.message);
                return;
            }

            // 2. Notification logic
            try {
                // Find current app title for the message
                const currentApp = applications.find(a => a.id === applicationId);
                const jobTitle = currentApp?.jobs?.title || "your application";

                await supabase.from('notifications').insert([{
                    user_id: applicantUserId,
                    message: `Your status for "${jobTitle}" is now ${newStatus}.`
                }]);
            } catch (nErr) {
                console.error("Notification silent fail:", nErr);
            }

            // 3. Update State
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));

            if (selectedApp?.id === applicationId) {
                setSelectedApp(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loading) return <div className="p-8 text-center font-medium">Loading Hiring Board...</div>

    return (
        <div className="p-6 h-screen bg-gray-50 flex overflow-x-auto gap-4">
            {columns.map(col => (
                <div key={col} className="min-w-[300px] bg-gray-100 rounded-lg p-4 flex flex-col border border-gray-200">
                    <h2 className="font-bold text-gray-700 mb-4 capitalize text-sm flex justify-between items-center">
                        {/* UI fix: Display 'pending' as 'New' */}
                        {col === 'pending' ? 'New Applicants' : col}
                        <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-gray-300">
                            {applications.filter(a => (a.status || 'pending') === col).length}
                        </span>
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {applications
                            .filter(app => (app.status || 'pending') === col)
                            .map(app => (
                                <ApplicantCard
                                    key={app.id}
                                    app={app}
                                    onReview={() => {
                                        // Move to 'reviewed' (lowercase) if it was 'pending'
                                        if (app.status === 'pending') {
                                            updateStatus(app.id, 'reviewed', app.applicants.user_id)
                                        }
                                        setSelectedApp(app)
                                    }}
                                    onAccept={() => updateStatus(app.id, 'accepted', app.applicants.user_id)}
                                    onReject={() => updateStatus(app.id, 'rejected', app.applicants.user_id)}
                                />
                            ))}
                    </div>
                </div>
            ))}

            {selectedApp && (
                <ApplicantModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </div>
    )
}

function ApplicantCard({ app, onReview, onAccept, onReject }) {
    return (
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="mb-2">
                <h3 className="font-semibold text-gray-800">{app.applicants?.profiles?.name || 'Unknown'}</h3>
                <p className="text-xs text-blue-600 font-medium line-clamp-1">{app.jobs?.title}</p>
            </div>

            <p className="text-xs text-gray-500 mb-4 line-clamp-2 italic">
                {Array.isArray(app.applicants?.skills)
                    ? app.applicants.skills.filter(s => s.trim() !== "").join(', ')
                    : app.applicants?.skills || "No skills listed"}
            </p>

            <div className="flex gap-2">
                <button onClick={onReview} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1">
                    <Eye size={14} /> Review
                </button>

                {/* Hide buttons if already in final states */}
                {app.status !== 'accepted' && app.status !== 'rejected' && (
                    <>
                        <button onClick={onAccept} className="bg-green-100 hover:bg-green-500 hover:text-white text-green-700 p-1.5 rounded transition-colors" title="Accept">
                            <Check size={16} />
                        </button>
                        <button onClick={onReject} className="bg-red-100 hover:bg-red-500 hover:text-white text-red-700 p-1.5 rounded transition-colors" title="Reject">
                            <X size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

function ApplicantModal({ app, onClose, onUpdateStatus }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col scale-in-center">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{app.applicants?.profiles?.name}</h2>
                        <p className="text-sm text-gray-500">Applying for {app.jobs?.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XCircle size={28} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <span className="text-sm font-bold text-blue-800 capitalize">Status: {app.status}</span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => onUpdateStatus(app.id, 'accepted', app.applicants.user_id)}
                                className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                            >
                                Accept Applicant
                            </button>
                            <button
                                onClick={() => onUpdateStatus(app.id, 'rejected', app.applicants.user_id)}
                                className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {Array.isArray(app.applicants?.experience)
                                    ? app.applicants.experience.filter(i => i && i.trim() !== "").join(', ')
                                    : app.applicants?.experience || 'None listed'}
                            </p>
                        </div>

                        {/* Skills Section */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(app.applicants?.skills) ? (
                                    app.applicants.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium lowercase">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-700">{app.applicants?.skills || 'None listed'}</span>
                                )}
                            </div>
                        </div>

                        {/* Education Section - Handling the Array of Objects */}
                        <div className="pt-4 border-t">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education</h4>
                            <div className="space-y-2">
                                {Array.isArray(app.applicants?.education) && app.applicants.education.length > 0 ? (
                                    app.applicants.education.map((edu) => (
                                        <div key={edu.id} className="text-sm">
                                            <p className="font-bold text-gray-800">{edu.degree}</p>
                                            <p className="text-gray-600">{edu.school} • <span className="text-gray-400">{edu.year}</span></p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-700">None listed</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Letter</h4>
                        <p className="text-sm text-gray-600 italic">"{app.cover_letter || 'No cover letter provided'}"</p>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-800">Resume / CV</h4>
                        {app.cv_url ? (
                            <a href={app.cv_url} target="_blank" className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                                <FileText size={18} /> View Document
                            </a>
                        ) : <span className="text-xs text-gray-400">No file uploaded</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}