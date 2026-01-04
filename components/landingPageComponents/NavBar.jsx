"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import { redirectToDashboard } from "../../lib/redirectToDashboard";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabase();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        setSession(currentSession.user);
     
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentSession.user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
    };

    loadUserData();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s?.user ?? null);
      if (s?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", s.user.id)
          .single();
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, [supabase]);

  
  const handleDashboardClick = () => {
    if (!session) {
      router.push("/register");
    } else {
      redirectToDashboard(userRole, router);
    }
  };

  if (pathname !== "/") return null;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#170e2c]/80 backdrop-blur-md border-b border-white/10 h-14" : "bg-transparent h-20"
    }`}>
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-6">
        
        <Link href="/" className="transition hover:opacity-80 flex-shrink-0">
          <Image 
            src="/uploads/logo2.png" 
            alt="Jobify" 
            width={130} 
            height={24} 
            className="brightness-0 invert object-contain" 
          />
        </Link>

        
        <div className="hidden md:flex items-center gap-10">
          {["Features", "How It Works", "Contact"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-gray-300 hover:text-[#7270b1] transition-colors">
              {item}
            </Link>
          ))}
          
         
          <button 
            onClick={handleDashboardClick}
            className="bg-[#5f5aa7] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#7270b1] shadow-lg shadow-[#5f5aa7]/20 transition-all active:scale-95">
            {session ? "Dashboard" : "Get Started"}
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

     
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#170e2c] border-b border-white/10 p-6 space-y-4 md:hidden animate-in slide-in-from-top duration-300">
          {["Features", "How It Works", "Contact"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-lg text-gray-300" onClick={() => setIsOpen(false)}>
              {item}
            </Link>
          ))}
          <button 
            onClick={() => { setIsOpen(false); handleDashboardClick(); }}
            className="w-full text-left text-lg text-[#7270b1] font-bold">
            {session ? "Dashboard" : "Get Started"}
          </button>
        </div>
      )}
    </nav>
  );
}
