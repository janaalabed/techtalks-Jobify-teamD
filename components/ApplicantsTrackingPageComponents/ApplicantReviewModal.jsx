import { X, FileText, Briefcase, Star, MapPin, ExternalLink, GraduationCap, History, ChevronRight } from 'lucide-react';

export default function ApplicantModal({ app, onClose, onUpdateStatus }) {
    const safeParse = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { return JSON.parse(data); } catch (e) { return []; }
    };

    const skills = safeParse(app.applicants?.skills);
    const experience = safeParse(app.applicants?.experience);
    const education = safeParse(app.applicants?.education);

    return (
        <div className="fixed inset-0 bg-[#170e2c]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 md:p-10">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[0.3rem] shadow-[0_32px_64px_-12px_rgba(23,14,44,0.2)] overflow-hidden flex flex-col border border-white">
                
               
                <div className="px-8 md:px-12 py-8 flex justify-between items-center border-b border-[#f6f7ff] shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#f6f7ff] flex items-center justify-center text-[#3e3875] text-xl font-black border border-[#3e3875]/5 shadow-inner">
                            {app.applicants?.profiles?.name?.charAt(0) || '?'}
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight text-[#170e2c]">
                                {app.applicants?.profiles?.name}
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-medium text-[#7270b1]">
                                <span className="flex items-center gap-1.5 font-bold">
                                    <Briefcase size={12} /> {app.jobs?.title}
                                </span>                                                             
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-[#f6f7ff] text-[#7270b1] transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            
                            
                            <div className="lg:col-span-8 space-y-12">
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-black text-[#5f5aa7] uppercase tracking-[0.25em] flex items-center gap-2">
                                        <Star size={14} /> Introduction
                                    </h4>
                                    <p className="text-[#170e2c] text-lg leading-relaxed font-medium">
                                        {app.cover_letter || 'No cover letter provided for this application.'}
                                    </p>
                                </section>

                                <section className="space-y-8">
                                    <h4 className="text-[10px] font-black text-[#5f5aa7] uppercase tracking-[0.25em] flex items-center gap-2">
                                        <History size={14} /> Professional Experience
                                    </h4>
                                    <div className="space-y-10 border-l-2 border-[#f6f7ff] ml-2 pl-8">
                                        {experience.length > 0 ? experience.map((exp, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[35px] top-1.5 w-3 h-3 rounded-full bg-[#3e3875] border-4 border-white"></div>
                                                <h5 className="font-bold text-[#170e2c] text-lg leading-none">{exp.role || exp.title}</h5>
                                                <p className="text-[#5f5aa7] text-sm font-semibold mt-2">{exp.company}</p>
                                                <p className="text-[#7270b1] text-xs mt-1 font-bold opacity-60 uppercase tracking-wider">{exp.duration || exp.years}</p>
                                                {exp.description && <p className="text-[#7270b1] text-sm mt-3 leading-relaxed">{exp.description}</p>}
                                            </div>
                                        )) : <p className="text-sm text-[#7270b1] italic">No experience listed.</p>}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Info (Right) */}
                            <div className="lg:col-span-4 space-y-12">
                                <section className="space-y-6">
                                    <h4 className="text-[10px] font-black text-[#5f5aa7] uppercase tracking-[0.25em] flex items-center gap-2">
                                        <GraduationCap size={14} /> Education
                                    </h4>
                                    <div className="space-y-6">
                                        {education.length > 0 ? education.map((edu, idx) => (
                                            <div key={idx}>
                                                <h5 className="font-bold text-[#170e2c] text-sm">{edu.degree || edu.qualification}</h5>
                                                <p className="text-[#5f5aa7] text-xs font-semibold mt-1">{edu.institution || edu.school}</p>
                                                <p className="text-[#7270b1] text-[10px] mt-1">{edu.year || edu.duration}</p>
                                            </div>
                                        )) : <p className="text-sm text-[#7270b1] italic">No education history listed.</p>}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h4 className="text-[10px] font-black text-[#5f5aa7] uppercase tracking-[0.25em]">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, idx) => (
                                            <span key={idx} className="bg-[#f6f7ff] text-[#3e3875] px-3 py-1.5 rounded-xl text-[11px] font-bold border border-[#3e3875]/5">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                {app.cv_url && (
                                    <section className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[#5f5aa7] uppercase tracking-[0.25em]">Attachments</h4>
                                        <a 
                                            href={app.cv_url} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="group flex items-center gap-3 text-[#3e3875] hover:text-[#170e2c] transition-colors"
                                        >
                                            <FileText size={18} />
                                            <span className="text-xs font-bold underline decoration-[#3e3875]/20 underline-offset-4 font-black uppercase tracking-tight">Full Resume.pdf</span>
                                            <ExternalLink size={14} className="opacity-50" />
                                        </a>
                                    </section>
                                )}
                            </div>
                        </div>

                       
                        <div className="mt-16 pt-10 border-t border-[#f6f7ff]">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-[#7270b1] uppercase tracking-[0.25em]">Application Verdict</h4>
                                    <p className="text-sm text-[#7270b1] font-medium">Finalize your decision for this candidate.</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <button 
                                        onClick={() => onUpdateStatus(app.id, 'rejected', app.applicants.user_id)} 
                                        className="px-8 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                    >
                                        Decline
                                    </button>
                                    <button 
                                        onClick={() => onUpdateStatus(app.id, 'accepted', app.applicants.user_id)} 
                                        className="px-5 py-4 bg-[#44bd42] text-white rounded-1xl font-bold text-sm hover:bg-[#45db75] transition-all shadow-xl shadow-[#3e3875]/20 active:scale-[0.98]"
                                    >
                                        Approve Candidate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="px-12 py-5 bg-[#fcfcff] border-t border-[#f6f7ff] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-[#7270b1] uppercase tracking-[0.2em]">
                            Current Status: {app.status}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#7270b1]/60 uppercase tracking-tight">
                        Applied {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>
        </div>
    );
}