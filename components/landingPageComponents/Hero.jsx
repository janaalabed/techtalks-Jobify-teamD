"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 bg-[#170e2c] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5f5aa7]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#3e3875]/30 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#3e3875]/30 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#7270b1] rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">New: One-Click Apply is Live</span>
          </div>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6">
            Find Internships & Jobs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5f5aa7] to-[#7270b1]">
              Smarter with Jobify
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            A modern hiring ecosystem where ambitious students meet forward-thinking companies.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
            <a href="/register" className="bg-white text-[#170e2c] px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-gray-100 transition-all active:scale-95">
              Get Started for Free
            </a>
            <a href="#how-it-works" className="bg-[#3e3875]/30 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-[#3e3875]/50 transition-all">
              See How It Works
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl relative">
          <div className="relative z-10 bg-gradient-to-tr from-[#3e3875]/40 to-transparent p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Image src="/uploads/purple2.jpg" alt="Platform" width={600} height={450} className="rounded-2xl shadow-2xl" priority />
          </div>
        </div>
      </div>
    </section>
  );
}