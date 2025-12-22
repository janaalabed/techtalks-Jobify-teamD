"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { redirectToDashboard } from "../../lib/redirectToDashboard";
import getSupabase from "../../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabase();

  useEffect(() => {
    // Get current Supabase session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session?.user ?? null);
    };
    fetchSession();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user ?? null);
    });

    // Scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase]);

  const handleGoToDashboard = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.id)
      .single();

    redirectToDashboard(profile?.role, router);
  };

  // Render nothing if not on landing page
  if (pathname !== "/") {
    return <></>;
  }

  return (
    <nav
      className={`sticky top-0 z-80 backdrop-blur transition-shadow duration-300 border-b ${
        scrolled
          ? "bg-white/90 shadow-md border-gray-200"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[80px]">
        <Link href="/" className="flex items-center">
          <Image src="/uploads/logo2.png" alt="Jobify" width={150} height={32} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["How It Works", "Features", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-700 hover:text-[#14364f] transition"
            >
              {item}
            </Link>
          ))}

          {session ? (
            <button
              onClick={handleGoToDashboard}
              className="bg-[#2529a1] text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              Go to Dashboard
            </button>
          ) : (
            <Link
              href="/register"
              className="bg-[#2529a1] text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#14364f] text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          {["How It Works", "Features", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="block px-6 py-3 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}

          {session ? (
            <button
              onClick={handleGoToDashboard}
              className="block px-6 py-3 bg-[#14364f] text-white w-full text-left"
            >
              Go to Dashboard
            </button>
          ) : (
            <Link
              href="/register"
              className="block px-6 py-3 bg-[#14364f] text-white w-full text-center"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
