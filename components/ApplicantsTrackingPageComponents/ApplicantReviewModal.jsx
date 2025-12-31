import { X, FileText, Briefcase, Star, MapPin, ExternalLink, GraduationCap, History, Calendar, CheckCircle2 } from 'lucide-react';

export default function ApplicantModal({ app, onClose, onUpdateStatus }) {
    const safeParse = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { return JSON.parse(data); } catch (e) { return []; }
    };

    const skills = safeParse(app.applicants?.skills);
    const experience = safeParse(app.applicants?.experience);
    const education = safeParse(app.applicants?.education);

    // Reusable Header Component for internal consistency
    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#f1f0fb] flex items-center justify-center text-[#5f5aa7]">
                <Icon size={16} />
            </div>
            <h4 className="text-[13px] font-bold text-[#3e3875] uppercase tracking-wider">
                {title}
            </h4>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#170e2c]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-6">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 font-sans">
                
                {/* 1. TOP NAV / HEADER */}
                <header className="px-8 md:px-12 py-8 bg-[#e0e2ff]/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#f1f0fb] flex items-center justify-center text-[#3e3875] text-3xl font-black border-4 border-white shadow-xl ring-1 ring-slate-100">
                            {app.applicants?.profiles?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-bold tracking-tight text-[#170e2c]">{app.applicants?.profiles?.name}</h2>
                                <span className="px-3 py-1 bg-[#45db75]/10 text-[#2ba355] text-[10px] font-bold uppercase tracking-tighter rounded-full flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2ba355] animate-pulse" />
                                    {app.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-semibold text-[#5f5aa7]">
                                <span className="flex items-center gap-1.5"><Briefcase size={16} /> {app.jobs?.title}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                                    Applied {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="group p-2 rounded-full bg-slate-50 text-[#7270b1] transition-all hover:bg-[#170e2c] hover:text-white">
                        <X size={20} strokeWidth={2} />
                    </button>
                </header>

                {/* 2. MAIN SCROLLABLE BODY */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcff]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
                        
                        {/* LEFT COLUMN: Narrative */}
                        <div className="lg:col-span-7 p-8 md:p-12 space-y-12 bg-white">
                            <section>
                                <SectionHeader icon={Star} title="Summary" />
                                <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative">
                                    <p className="text-slate-600 text-lg leading-relaxed font-medium italic relative z-10">
                                        "{app.cover_letter || 'No cover letter provided.'}"
                                    </p>
                                </div>
                            </section>

                            <section>
                                <SectionHeader icon={History} title="Work History" />
                                <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-slate-100">
                                    {experience.length > 0 ? experience.map((exp, idx) => (
                                        <div key={idx} className="relative pl-12 group">
                                            <div />
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-[#170e2c] text-xl tracking-tight">{exp.role || exp.title}</h5>
                                                <span className="text-[10px] font-bold text-[#3e3875] bg-[#f1f0fb] px-3 py-1 rounded-full uppercase">
                                                    {exp.year || exp.duration}
                                                </span>
                                            </div>
                                            <p className="text-[#5f5aa7] font-bold text-sm mb-3">{exp.company}</p>
                                            <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    )) : <p className="text-slate-400 italic font-medium">No experience listed.</p>}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Metadata & Quick Info */}
                        <div className="lg:col-span-5 p-8 md:p-12 space-y-10 border-l border-slate-100">
                            <section>
                                <SectionHeader icon={GraduationCap} title="Education" />
                                <div className="space-y-4">
                                    {education.map((edu, idx) => (
                                        <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-[#5f5aa7]/30 transition-colors">
                                            <h5 className="font-bold text-[#170e2c] text-[15px] leading-tight mb-1">{edu.degree || edu.qualification}</h5>
                                            <p className="text-slate-500 text-xs font-semibold">{edu.institution || edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-4 bg-[#5f5aa7] rounded-full" />
                                    <h4 className="text-[13px] font-bold text-[#3e3875] uppercase tracking-wider">Tech Stack & Skills</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-white border border-slate-200 text-[#3e3875] text-[11px] font-bold rounded-xl hover:border-[#3e3875] transition-colors shadow-sm uppercase tracking-tight">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {app.cv_url && (
                                <section className="pt-6 border-t border-slate-100">
                                    <a href={app.cv_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 rounded-3xl bg-[#170e2c] text-white group hover:bg-[#3e3875] transition-all">
                                        <div className="flex items-center gap-4">
                                            <FileText size={24} className="text-[#a5a1e2]" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Attachment</p>
                                                <p className="text-sm font-bold">Curriculum Vitae</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-70" />
                                    </a>
                                </section>
                            )}
                        </div>
                    </div>
                </main>

                {/* 3. BOTTOM ACTION BAR */}
                <footer className="px-12 py-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#5f5aa7]">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-[#170e2c]">Decision Required</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Awaiting Recruiter Action</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => onUpdateStatus(app.id, 'rejected', app.applicants.user_id)} 
                            className="flex-1 md:flex-none px-10 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 transition-all border border-transparent"
                        >
                            Reject
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(app.id, 'accepted', app.applicants.user_id)} 
                            className="flex-1 md:flex-none px-12 py-4 bg-[#3e3875] text-white rounded-[1.25rem] font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-[#170e2c] transition-all shadow-xl shadow-[#3e3875]/20"
                        >
                            Approve Candidate
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}