"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Globe, Briefcase, MapPin, Building2, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowRight,ArrowLeft } from "lucide-react";
import getSupabase from "../../../lib/supabaseClient";

export default function CreateCompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  
 
  const formRef = useRef(null);


  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyData = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("employers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setIsEditing(true);
        setCompanyName(data.company_name || "");
        setWebsite(data.website || "");
        setIndustry(data.industry || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setExistingLogo(data.logo_url);
      }
    };

    fetchCompanyData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = getSupabase();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      setMessage("You must be logged in");
      setLoading(false);
      return;
    }
    const user = userData.user;

    let logoUrl = existingLogo;

    if (logoFile) {
      const fileExt = logoFile.name.split(".").pop();
      const filePath = `company-logos/${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("applicant-assets")
        .upload(filePath, logoFile, { upsert: true });

      if (uploadError) {
        setMessage(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("applicant-assets").getPublicUrl(filePath);
      logoUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("employers")
      .upsert({
        user_id: user.id,
        company_name: companyName,
        website: website,
        industry: industry,
        location: location,
        description: description,
        logo_url: logoUrl,
      }, { onConflict: 'user_id' });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Company profile saved successfully ✅");
      router.push("/profile/previewCompanyProfile");
    }

    setLoading(false);
  }

  const getFileNameFromUrl = (url) => {
      if (!url) return null;
      try {
          const parts = url.split('/');
          return parts[parts.length - 1];
      } catch (e) {
          return "Existing Logo";
      }
  };

 return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-x-hidden">
      {/* Hero Background Decor */}
      <div className="bg-[#170e2c] h-64 md:h-80 w-full absolute top-0 left-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3e3875]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-20">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors text-sm md:text-base"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="mb-8 md:mb-12 text-white">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {isEditing ? "Edit" : "Create"} <span className="text-[#7270b1]">Company Profile</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-sm md:text-base">
            {isEditing ? "Update your company details" : "Create your professional presence to start hiring"}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-[#170e2c]/5 border border-slate-100 overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-6 md:px-10 md:py-8 bg-slate-50/50">
                <h2 className="text-xl font-bold text-[#170e2c]">Company Details</h2>
                <p className="mt-1 text-sm text-slate-500 font-medium">Information to showcase to potential candidates</p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">
                    Company Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" size={18} />
                    <input
                      name="company_name"
                      required
                      placeholder="e.g. TechTalks LB"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-sm text-[#170e2c] placeholder:text-slate-400 focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Website & Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">Website</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" size={18} />
                      <input
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-sm text-[#170e2c] focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">Industry</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" size={18} />
                      <input
                        name="industry"
                        placeholder="e.g. Software, Finance"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-sm text-[#170e2c] focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5f5aa7] transition-colors" size={18} />
                    <input
                      name="location"
                      placeholder="e.g. Beirut, Lebanon"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-sm text-[#170e2c] focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">About the Company</label>
                  <textarea
                    name="description"
                    rows={5}
                    placeholder="Describe your company culture, mission, and benefits..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-[#170e2c] placeholder:text-slate-400 resize-none focus:border-[#5f5aa7] focus:ring-4 focus:ring-[#5f5aa7]/5 outline-none transition-all font-bold min-h-[150px]"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-[11px] font-black text-[#7270b1] uppercase tracking-widest mb-3 ml-1">Company Logo</label>
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-slate-50/50 hover:bg-[#5f5aa7]/5 hover:border-[#5f5aa7]/50 transition-all group overflow-hidden">
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-[#5f5aa7]" size={24} />
                      </div>
                      <p className="text-xs font-black text-[#3e3875] truncate max-w-[250px]">
                        {logoFile ? logoFile.name : (getFileNameFromUrl(existingLogo) || "Upload Company Logo")}
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-[#7270b1]">PNG, JPG or SVG (Max 5MB)</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
                  </label>
                </div>

                {/* Feedback Message */}
                {message && (
                  <div className={`rounded-2xl px-5 py-4 text-sm font-bold flex items-center gap-3 transition-all ${
                    message.toLowerCase().includes("success")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}>
                    {message.toLowerCase().includes("success") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message}
                  </div>
                )}

                {/* Submit */}
                <div className="pt-4 md:pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#170e2c] hover:bg-[#3e3875] text-white font-black py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-[#170e2c]/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>{isEditing ? "Update Profile" : "Create Company Profile"} <ArrowRight size={20} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#3e3875] rounded-[2rem] md:rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#3e3875]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="font-black text-xl mb-6 relative z-10">Pro Tips 💡</h3>
              <ul className="space-y-6 text-sm relative z-10">
                <li className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#5f5aa7] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">1</div>
                  <span className="font-medium text-indigo-50 leading-relaxed">Profiles with logos get <strong className="text-white underline">4x more</strong> applicants.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#5f5aa7] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">2</div>
                  <span className="font-medium text-indigo-50 leading-relaxed">A clear mission statement attracts candidates who share your values.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#5f5aa7] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">3</div>
                  <span className="font-medium text-indigo-50 leading-relaxed">Mentioning benefits like "Remote Work" or "Healthcare" increases interest by 30%.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}