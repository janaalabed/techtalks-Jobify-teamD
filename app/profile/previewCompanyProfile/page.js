"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../../lib/supabaseClient";
import Navbar from "../../../components/companyDashboardComponents/NavBar";
import { MapPin, Globe, Briefcase, Building2, Edit } from "lucide-react";

export default function CompanyProfilePage() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const router = useRouter();
    const supabase = getSupabase();

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data, error } = await supabase
                    .from("employers")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setCompany(data);
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#edf0f7]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-[#3e3875] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-[#f8fafc]">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[80vh] px-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-slate-100">
                        <div className="w-16 h-16 bg-[#3e3875]/10 text-[#3e3875] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-[#170e2c] mb-2">No Company Profile Found</h2>
                        <p className="text-slate-500 mb-6">Create your company profile to start posting jobs and attracting talent.</p>
                        <button
                            onClick={() => router.push("/employers/create")}
                            className="w-full py-3 rounded-2xl bg-[#3e3875] text-white font-bold hover:bg-[#170e2c] transition-colors"
                        >
                            Create Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

           
            <div className="relative bg-[#170e2c] pt-12 md:pt-20 pb-24 md:pb-32">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3e3875]/40 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                    
                    <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full shadow-2xl shadow-[#3e3875]/20 mb-6 flex items-center justify-center overflow-hidden border-4 border-white/10">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.company_name} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 size={40} className="md:size-12 text-[#3e3875]/40" />
                        )}
                    </div>

                    
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2 px-2">
                        {company.company_name}
                    </h1>

                    
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6 text-indigo-100/80 text-xs md:text-sm font-medium">
                        {company.industry && (
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 md:px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <Briefcase size={14} />
                                {company.industry}
                            </div>
                        )}
                        {company.location && (
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 md:px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <MapPin size={14} />
                                {company.location}
                            </div>
                        )}
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/10 px-3 md:px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <Globe size={14} />
                                <span className="hidden xs:inline">Website</span>
                            </a>
                        )}
                    </div>

                    <button
                        onClick={() => router.push("/employers/create")}
                        className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all font-semibold text-sm active:scale-95"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                </div>
            </div>

           
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 relative z-20 pb-20">
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-[#170e2c]/5 border border-slate-200 p-6 md:p-12">
                    <div className="max-w-none">
                        <h2 className="text-xl md:text-2xl font-bold text-[#170e2c] mb-6 flex items-center gap-3">
                            <div className="h-6 w-1 bg-[#5f5aa7] rounded-full" />
                            About Us
                        </h2>
                        {company.description ? (
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base md:text-lg">
                                {company.description}
                            </p>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                <p className="text-slate-400 italic text-sm md:text-base">No description added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
