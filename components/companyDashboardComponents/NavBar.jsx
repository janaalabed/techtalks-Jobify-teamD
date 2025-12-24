"use client";

import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { LayoutDashboard, UserCircle, Users, LogOut } from "lucide-react";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Trigger shadow and background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/employers/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Profile", path: "/profile/previewCompanyProfile", icon: <UserCircle size={18} /> },
    { name: "Applicants", path: "/employers/applicants", icon: <Users size={18} /> },
  ];

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 border-b ${
      scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-200 py-2"
        : "bg-white border-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => router.push("/")}
        >
          <Image
            src="/uploads/logo2.png"
            alt="Jobify Logo"
            width={140}
            height={30}
            className="object-contain"
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-[#3e3875]/10 text-[#3e3875]" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#3e3875]"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-slate-200 mx-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Logout (Only visible on small screens) */}
        <div className="md:hidden">
            <button onClick={handleLogout} className="p-2 text-rose-600">
                <LogOut size={24} />
            </button>
        </div>
      </div>
    </nav>
  );
}