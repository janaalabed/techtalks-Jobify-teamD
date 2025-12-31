
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image"; 
import { LayoutDashboard, UserCircle, Users, LogOut } from "lucide-react";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

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
    { name: "Applicants", path: "/employer-ApplicantsTracking", icon: <Users size={18} /> },
     { name: "Profile", path: "/profile/previewCompanyProfile", icon: <UserCircle size={18} /> },
  ];

  return (
    <nav className={`w-full z-[100] transition-all duration-300 border-b border-white/10 shrink-0 h-[72px] flex items-center ${
      scrolled
        ? "bg-[#170e2c]/95 backdrop-blur-md shadow-lg"
        : "bg-[#170e2c]"
    }`}>
      <div className="w-full mx-auto flex items-center justify-between px-8">
        
        {/* Logo with Inversion for Dark Theme */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => router.push("/")}
        >
          <Image
            src="/uploads/logo2.png"
            alt="Jobify Logo"
            width={140}
            height={30}
            className="object-contain brightness-0 invert"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-[#5f5aa7]/20 text-white" 
                    : "text-gray-300 hover:bg-white/5 hover:text-[#7270b1]"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Logout */}
        <div className="md:hidden">
            <button onClick={handleLogout} className="p-2 text-rose-400">
                <LogOut size={24} />
            </button>
        </div>
      </div>
    </nav>
  );
}