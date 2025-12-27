import { Eye, Check, X, MoreHorizontal } from 'lucide-react';

export default function ApplicantCard({ app, onReview, onAccept, onReject }) {
    const skills = Array.isArray(app.applicants?.skills) ? app.applicants.skills : [];

    return (
        <div className="group relative bg-[#edf0f7] p-5 rounded-1xl border border-[#7270b1]/10 shadow-[0_4px_20px_-4px_rgba(114,112,177,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(62,56,117,0.15)] transition-all duration-500 ease-out">
            
            
            <div className="flex justify-between items-center mb-5">
                <div className="relative">
                    <div className="w-11 h-11 rounded-1xl bg-gradient-to-br from-[#f6f7ff] to-[#e2e4ff] flex items-center justify-center text-[#3e3875] font-black shadow-sm border border-white">
                        {app.applicants?.profiles?.name?.charAt(0) || '?'}
                    </div>
                    
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${app.status === 'accepted' ? 'bg-green-500' : 'bg-[#5f5aa7]'}`}></div>
                    </div>
                </div>
               
            </div>

            {/* Candidate Info */}
            <div className="mb-6">
                <h3 className="font-bold text-[#170e2c] text-[16px] tracking-tight group-hover:text-[#3e3875] transition-colors duration-300">
                    {app.applicants?.profiles?.name || 'Candidate'}
                </h3>
                <p className="text-xs text-[#7270b1] font-medium mt-1 opacity-80 uppercase tracking-wider">
                    {app.jobs?.title}
                </p>
            </div>
            
            {/* Actions: Integrated design */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={onReview} 
                    className="flex-[2] bg-[#3e3875] hover:bg-[#170e2c] text-white py-3 rounded-1xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#170e2c]/10"
                >
                    Review
                </button>

                {(app.status === 'pending' || app.status === 'reviewed') && (
                    <div className="flex flex-1 gap-2">
                        <button 
                            onClick={onAccept} 
                            className="flex-1 aspect-square flex items-center justify-center bg-[#f6f7ff] hover:bg-green-500 hover:text-white text-[#3e3875] rounded-1xl transition-all duration-300 border border-[#7270b1]/5"
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={onReject} 
                            className="flex-1 aspect-square flex items-center justify-center bg-[#f6f7ff] hover:bg-red-500 hover:text-white text-[#3e3875] rounded-1xl transition-all duration-300 border border-[#7270b1]/5"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}