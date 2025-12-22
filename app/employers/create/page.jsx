
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "../../../lib/supabaseClient";

export default function CreateCompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const formRef = useRef(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = getSupabase();

    // 1️⃣ Get logged-in user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setMessage("You must be logged in");
      setLoading(false);
      return;
    }
    const user = userData.user;

    if (!formRef.current) {
      setMessage("Form is not accessible. Try again.");
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);

    let logoUrl = null;

    // 2️⃣ Upload logo if exists
    if (logoFile) {
      const fileExt = logoFile.name.split(".").pop();
      const filePath = `company-logos/${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("applicant-assets")
        .upload(filePath, logoFile, { upsert: true });

      if (uploadError) {
        setMessage(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("applicant-assets")
        .getPublicUrl(filePath);

      logoUrl = data.publicUrl;
    }

    // 3️⃣ UPSERT employer profile
    const { error } = await supabase
      .from("employers")
      .upsert({
        user_id: user.id,
        company_name: formData.get("company_name"),
        website: formData.get("website"),
        industry: formData.get("industry"),
        location: formData.get("location"),
        description: formData.get("description"),
        logo_url: logoUrl,
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Company profile created successfully ✅");
      router.push("/employers/dashboard");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header omitted for brevity */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar omitted for brevity */}

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="border-b border-slate-200 px-6 sm:px-8 py-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Company Information
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Fill in the details below to create your company profile
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-8">

                {/* Company Name - Full Width */}
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                       Company Name <span className="text-red-500">*</span>
                     </label>
                     <input
                       name="company_name"
                       required
                       placeholder="e.g. TechTalks LB"
                       className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                   />
                    <p className="mt-2 text-xs text-slate-500">
                      This is how your company will appear to candidates
                    </p>
                  </div> 

               {/* Website & Industry - Two Columns */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Website */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Website
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
        </svg>
      </div>
      <input
        name="website"
        type="url"
        placeholder="https://example.com"
        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  </div>

  {/* Industry */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Industry
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <input
        name="industry"
        placeholder="e.g. Software, Marketing, Finance"
        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  </div>
</div>

{/* Location - Full Width */}
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Location
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <input
      name="location"
      placeholder="e.g. Beirut, Lebanon"
      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
    />
  </div>
</div>

{/* Company Description - Full Width */}
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    Company Description
  </label>
  <textarea
    name="description"
    rows={5}
    placeholder="Tell us about your company, culture, mission, and what makes you unique as an employer..."
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
  />
  <p className="mt-2 text-xs text-slate-500">
    A compelling description helps attract the right talent
  </p>
</div>


                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Logo
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">
                        {logoFile ? logoFile.name : "Drop image or click to upload"}
                      </p>
                    </div>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`rounded-xl px-4 py-3.5 text-sm flex items-start gap-3 ${
                    message.toLowerCase().includes("success")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{message}</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                  <button type="button" className="order-2 sm:order-1 px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Save as Draft
                  </button>
                  <button type="submit" disabled={loading} className="order-1 sm:order-2 flex-1 sm:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? "Creating profile..." : "Create Company Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
