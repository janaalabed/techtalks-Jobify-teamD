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
    <div className="fixed inset-0 bg-[#170e2c]/70 backdrop-blur-md flex items-end md:items-center justify-center z-[100] p-0 md:p-6 transition-all duration-300">
        <div className="bg-white w-full max-w-6xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 font-sans">
            
            {/* 1. HEADER SECTION */}
            <header className="px-6 md:px-12 py-6 md:py-8 bg-[#f8fafc] border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Avatar scaling */}
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-[#e0e2ff] flex items-center justify-center text-[#3e3875] text-2xl md:text-4xl font-black border-4 border-white shadow-xl ring-1 ring-slate-100">
                        {app.applicants?.profiles?.name?.charAt(0) || '?'}
                    </div>
                    
                    <div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-[#170e2c]">
                                {app.applicants?.profiles?.name}
                            </h2>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                {app.status}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#5f5aa7]">
                            <span className="flex items-center gap-1.5 opacity-80">
                                <Briefcase size={14} className="md:size-16" /> {app.jobs?.title}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                            <span className="hidden md:flex items-center gap-1.5 text-slate-400 font-medium">
                                <Calendar size={14} /> 
                                Applied {new Date(app.applied_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onClose} 
                    className="p-2.5 rounded-full bg-slate-50 text-[#7270b1] transition-all hover:bg-rose-50 hover:text-rose-600 border border-slate-100"
                >
                    <X size={22} strokeWidth={2.5} />
                </button>
            </header>

            {/* 2. SCROLLABLE CONTENT AREA */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    
                    {/* LEFT COLUMN: Narrative & Experience */}
                    <div className="lg:col-span-7 p-6 md:p-12 space-y-12">
                     
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Star size={18} fill="currentColor" />
                                </div>
                                <h4 className="text-sm font-bold text-[#3e3875] uppercase tracking-widest">Candidate Summary</h4>
                            </div>
                            <div className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 relative">
                                <p className="text-slate-600 text-base md:text-lg leading-relaxed italic relative z-10">
                                    "{app.cover_letter || 'No cover letter provided.'}"
                                </p>
                            </div>
                        </section>

                        {/* Experience Timeline */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <History size={18} />
                                </div>
                                <h4 className="text-sm font-bold text-[#3e3875] uppercase tracking-widest">Work History</h4>
                            </div>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-slate-100">
                                {experience && experience.length > 0 ? experience.map((exp, idx) => (
                                    <div key={idx} className="relative pl-12 group">
                                        <div className="absolute left-[13px] top-2 w-2 h-2 rounded-full bg-[#5f5aa7] ring-4 ring-white" />
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-1">
                                            <h5 className="font-bold text-[#170e2c] text-lg">{exp.role || exp.title}</h5>
                                            <span className="text-[10px] font-bold text-[#3e3875] bg-[#f1f0fb] px-3 py-1 rounded-full uppercase self-start">
                                                {exp.year || exp.duration}
                                            </span>
                                        </div>
                                        <p className="text-[#5f5aa7] font-bold text-sm mb-2">{exp.company}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                )) : (
                                    <p className="text-slate-400 italic pl-12">No work history detailed.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Metadata & Education */}
                    <div className="lg:col-span-5 p-6 md:p-12 space-y-10 bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-100">
                        {/* Education Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <GraduationCap size={18} />
                                </div>
                                <h4 className="text-sm font-bold text-[#3e3875] uppercase tracking-widest">Education</h4>
                            </div>
                            <div className="space-y-4">
                                {education && education.map((edu, idx) => (
                                    <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-[#5f5aa7]/30 transition-colors">
                                        <h5 className="font-bold text-[#170e2c] text-[15px] leading-tight mb-1">{edu.degree || edu.qualification}</h5>
                                        <p className="text-slate-500 text-xs font-semibold">{edu.institution || edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills Cloud */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-4 bg-[#5f5aa7] rounded-full" />
                                <h4 className="text-sm font-bold text-[#3e3875] uppercase tracking-widest">Tech Stack</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills && skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 md:px-4 py-2 bg-white border border-slate-200 text-[#3e3875] text-[11px] font-bold rounded-xl shadow-sm uppercase">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* CV Download CTA */}
                        {app.cv_url && (
                            <section className="pt-6 border-t border-slate-200">
                                <a href={app.cv_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-[#170e2c] text-white group hover:bg-[#3e3875] transition-all shadow-xl shadow-[#170e2c]/10">
                                    <div className="flex items-center gap-4">
                                        <FileText size={20} className="text-indigo-300" />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Resume</p>
                                            <p className="text-sm font-bold">Download Full CV</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-70" />
                                </a>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            {/* 3. STICKY ACTION BAR */}
            <footer className="px-6 md:px-12 py-6 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                <div className="hidden md:flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#5f5aa7]">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#170e2c]">Decision Required</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Final Recruitment Stage</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => onUpdateStatus(app.id, 'rejected', app.applicants.user_id)} 
                        className="flex-1 md:flex-none px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all active:scale-95"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={() => onUpdateStatus(app.id, 'accepted', app.applicants.user_id)} 
                        className="flex-[2] md:flex-none px-12 py-3.5 bg-[#3e3875] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#170e2c] transition-all shadow-lg shadow-[#3e3875]/20 active:scale-95"
                    >
                        Approve Candidate
                    </button>
                </div>
            </footer>
        </div>
    </div>
);
}