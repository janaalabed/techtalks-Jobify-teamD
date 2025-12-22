"use client";

import { useRouter } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";

export default function Navbar() {
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
         
          <span>{ "Jobify logo"}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/jobs-list")} className="hover:text-blue-600">Home</button>
          <button onClick={() => router.push("/profile/previewApplicantProfile")} className="hover:text-blue-600">Profile</button>
          <button onClick={() => router.push("/jobs-list")} className="hover:text-blue-600">Applications</button>
          <button onClick={() => router.push("/bookmarks")} className="hover:text-blue-600">Saved Jobs</button>
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
