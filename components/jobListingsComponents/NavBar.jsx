"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image"; 
import { LayoutDashboard, UserCircle, Users, Bookmark, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const supabase = getSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    { id: "dashboard", name: "Dashboard", path: "/jobs-list", icon: <LayoutDashboard size={18} /> },
    { id: "applications", name: "My Applications", path: "/applications", icon: <Users size={18} /> },
    { id: "saved", name: "Saved Jobs", path: "/bookmarks", icon: <Bookmark size={18} /> },
    { id: "profile", name: "Profile", path: "/profile/previewApplicantProfile", icon: <UserCircle size={18} /> },
  ];

  return (
    <nav className={`w-full z-[100] transition-all duration-300 border-b border-white/10 shrink-0 h-[72px] flex items-center sticky top-0 ${
      scrolled
        ? "bg-[#170e2c]/95 backdrop-blur-md shadow-lg"
        : "bg-[#170e2c]"
    }`}>
      
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
        
        {/* Logo Section */}       
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
          onClick={() => router.push("/")}
        >
          <Image
            src="/uploads/logo2.png"
            alt="Jobify Logo"
            width={140}
            height={30}
            className="object-contain brightness-0 invert w-[110px] md:w-[140px]"
          />        
        </div>

        {/* Desktop Links - Hidden on md and below */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.id} 
                onClick={() => router.push(link.path)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-[13px] font-bold transition-all relative group ${
                  isActive 
                    ? "text-white bg-[#5f5aa7]/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`${isActive ? "text-[#7270b1]" : "text-gray-500 group-hover:text-[#7270b1]"}`}>
                  {link.icon}
                </span>
                {link.name}
              </button>
            );
          })}

          {/* Divider */}
          <div className="h-6 w-[1px] bg-white/10 mx-3 lg:mx-4" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#170e2c] border-b border-white/10 flex flex-col p-4 space-y-2 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => router.push(link.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === link.path ? "bg-[#5f5aa7]/20 text-white" : "text-gray-400"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
          <div className="h-[1px] bg-white/10 my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 active:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}