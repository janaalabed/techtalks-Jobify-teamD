"use client";

import { useState } from "react";
import getSupabase from "../../../lib/supabaseClient";

export default function CreateCompanyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = getSupabase();
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error || !sessionData.session) {
      setMessage("You must be logged in");
      setLoading(false);
      return;
    }

    const accessToken = sessionData.session.access_token;
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/employers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message || "Something went wrong");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Company Profile Setup
              </h1>
              <p className="mt-1 text-sm text-slate-600 hidden sm:block">
                Complete your profile to start hiring top talent
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <span className="text-slate-700 font-medium">Profile</span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-500 font-semibold text-xs">2</span>
                </div>
                <span className="text-slate-500">Post Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Why Complete Your Profile?</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Attract qualified candidates with a professional presence</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Build trust and credibility with detailed information</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Stand out with your company culture and mission</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Streamline your hiring process with organized profiles</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Our team is here to assist you with setting up your profile.
              </p>
              <button className="text-sm font-medium text-blue-600 bg-white rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          {/* Form */}
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

              <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8">
                <div className="space-y-8">
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
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
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

                  {/* Description - Full Width */}
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
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <label className="relative cursor-pointer">
                            <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                              Upload a file
                            </span>
                            <input
                              type="file"
                              name="logo"
                              accept="image/*"
                              className="sr-only"
                            />
                          </label>
                          <span className="text-sm text-slate-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, SVG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`rounded-xl px-4 py-3.5 text-sm flex items-start gap-3 ${
                      message.toLowerCase().includes('success') || message.toLowerCase().includes('created')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : message.toLowerCase().includes('error') || message.toLowerCase().includes('must be')
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{message}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      className="order-2 sm:order-1 px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="order-1 sm:order-2 flex-1 sm:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Creating profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Company Profile</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}