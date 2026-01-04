"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image"; 
import { LayoutDashboard, UserCircle, Users, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/employers/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Applicants", path: "/employer-ApplicantsTracking", icon: <Users size={18} /> },
    { name: "Profile", path: "/profile/previewCompanyProfile", icon: <UserCircle size={18} /> },
  ];

  return (
    <nav className={`w-full z-[100] transition-all duration-300 border-b border-white/10 shrink-0 h-[72px] flex items-center sticky top-0 ${
      scrolled
        ? "bg-[#170e2c]/95 backdrop-blur-md shadow-lg"
        : "bg-[#170e2c]"
    }`}>
      <div className="w-full mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
          onClick={() => router.push("/")}
        >
          <Image
            src="/uploads/logo2.png"
            alt="Jobify Logo"
            width={120}
            height={26}
            className="object-contain brightness-0 invert w-[100px] md:w-[140px]" 
          />
        </div>

        {/* Desktop Links - Hidden on md and below */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-[#5f5aa7]/20 text-white" 
                    : "text-gray-300 hover:bg-white/5 hover:text-[#7270b1]"
                }`}
              >
                <span className="hidden lg:inline-block">{link.icon}</span>
                {link.name}
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all whitespace-nowrap"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white transition-all"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#170e2c] border-b border-white/10 flex flex-col p-4 space-y-2 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                  isActive ? "bg-[#5f5aa7]/20 text-white" : "text-gray-400 active:bg-white/5"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            );
          })}
          <div className="h-[1px] bg-white/10 my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-rose-400 active:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}