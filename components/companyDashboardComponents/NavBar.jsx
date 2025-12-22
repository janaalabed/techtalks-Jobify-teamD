"use client";

import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";

export default function Navbar({ companyName }) {
  const supabase = getSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" onClick={() => router.push("/")}>
         
          <span>{companyName || "Company"}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/employers/dashboard")} className="hover:text-blue-600">Home</button>
          <button onClick={() => router.push("/profile/previewCompanyProfile")} className="hover:text-blue-600">Profile</button>
          <button onClick={() => router.push("/employers/applicants")} className="hover:text-blue-600">Applicants</button>
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
