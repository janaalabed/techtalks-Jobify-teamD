"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import getSupabase from "../../lib/supabaseClient";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
   const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className={`sticky top-0 z-80 backdrop-blur transition-shadow duration-300 border-b ${
        scrolled
          ? "bg-white/90 shadow-md border-gray-200"
          : "bg-white/80 border-gray-200"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[80px]">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/uploads/logo2.png"  // path to your logo in public folder
            alt="Jobify Logo"
            width={150}      // adjust as needed
            height={32}     // adjust as needed
          />
          
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
