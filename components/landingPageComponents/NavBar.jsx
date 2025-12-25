"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const supabase = getSupabase();

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session?.user ?? null);
    };
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s?.user ?? null));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, [supabase]);

  if (pathname !== "/") return null;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#170e2c]/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="transition hover:opacity-80">
          <Image src="/uploads/logo2.png" alt="Jobify" width={120} height={28} className="brightness-0 invert" />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {["Features", "How It Works", "Contact"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-gray-300 hover:text-[#7270b1] transition-colors">
              {item}
            </Link>
          ))}
          <Link href={session ? "/jobs-list" : "/register"}
            className="bg-[#5f5aa7] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#7270b1] shadow-lg shadow-[#5f5aa7]/20 transition-all active:scale-95">
            {session ? "Dashboard" : "Get Started"}
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#170e2c] border-b border-white/10 p-6 space-y-4 md:hidden">
          {["Features", "How It Works", "Footer"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-lg text-gray-300" onClick={() => setIsOpen(false)}>
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}