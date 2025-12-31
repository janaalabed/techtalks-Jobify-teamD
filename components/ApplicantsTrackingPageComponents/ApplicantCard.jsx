import { Eye, Check, X, MoreHorizontal } from 'lucide-react';

export default function ApplicantCard({ app, onReview, onAccept, onReject }) {
    const skills = Array.isArray(app.applicants?.skills) ? app.applicants.skills : [];

return (
    <div className="group relative bg-white p-4 md:p-5 rounded-2xl border border-[#3e3875]/5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="relative">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#f6f7ff] to-[#e2e4ff] flex items-center justify-center text-[#3e3875] font-bold border border-white">
                    {app.applicants?.profiles?.name?.charAt(0) || '?'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${app.status === 'accepted' ? 'bg-green-500' : 'bg-[#5f5aa7]'}`}></div>
                </div>
            </div>
        </div>

        <div className="mb-5">
            <h3 className="font-bold text-[#170e2c] text-sm md:text-base truncate group-hover:text-[#3e3875]">
                {app.applicants?.profiles?.name || 'Candidate'}
            </h3>
            <p className="text-[10px] text-[#7270b1] font-bold mt-1 opacity-80 uppercase tracking-wider truncate">
                {app.jobs?.title}
            </p>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={onReview} 
                className="flex-[2] bg-[#3e3875] text-white py-2.5 md:py-3 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-[#170e2c]"
            >
                Review
            </button>

            {(app.status === 'pending' || app.status === 'reviewed') && (
                <div className="flex flex-1 gap-1.5">
                    <button onClick={onAccept} className="flex-1 aspect-square flex items-center justify-center bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                        <Check size={14} strokeWidth={3} />
                    </button>
                    <button onClick={onReject} className="flex-1 aspect-square flex items-center justify-center bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors">
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            )}
        </div>
    </div>
);
}