"use client";

import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { LayoutDashboard, UserCircle, Users, Bookmark, LogOut } from "lucide-react";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { id: "dashboard", name: "Dashboard", path: "/jobs-list", icon: <LayoutDashboard size={18} /> },
    { id: "profile", name: "Profile", path: "/profile/previewApplicantProfile", icon: <UserCircle size={18} /> },
    { id: "applications", name: "My Applications", path: "/applications", icon: <Users size={18} /> },
    { id: "saved", name: "Saved Jobs", path: "/bookmarks", icon: <Bookmark size={18} /> },
  ];

  return (
    <nav className={`w-full z-[100] transition-all duration-300 border-b shrink-0 h-[72px] flex items-center ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-200"
        : "bg-white border-slate-100"
    }`}>
      <div className="w-full mx-auto flex items-center justify-between px-8">
        
      
        <div
          className="flex items-center cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
          onClick={() => router.push("/")}
        >
          <div className="relative w-[260px] h-[114px]">
            <Image
              src="/uploads/logo2.png"
              alt="Jobify Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.id} 
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative group ${
                  isActive 
                    ? "text-[#3e3875] bg-[#3e3875]/5" 
                    : "text-slate-500 hover:text-[#5f5aa7] hover:bg-slate-50"
                }`}
              >
                <span className={`${isActive ? "text-[#5f5aa7]" : "text-slate-400 group-hover:text-[#5f5aa7]"}`}>
                  {link.icon}
                </span>
                {link.name}
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-slate-200 mx-4" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="md:hidden">
        <button
  onClick={handleLogout}
  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
>
  <LogOut 
    size={18} 
    className="text-rose-600 transition-colors" 
  />
  <span className="text-rose-600 transition-colors">
    Logout
  </span>
</button>
        </div>
      </div>
    </nav>
  );
}