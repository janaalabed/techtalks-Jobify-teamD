"use client";

import React from "react";
import { UserPlus, MousePointerClick, LayoutDashboard, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Easy profile setup",
    desc: "Create your professional identity in minutes with our guided onboarding process.",
    icon: <UserPlus className="w-6 h-6" />,
  },
  {
    title: "One-click apply",
    desc: "Skip the repetitive forms. Apply to your dream roles instantly with saved credentials.",
    icon: <MousePointerClick className="w-6 h-6" />,
  },
  {
    title: "Track applications",
    desc: "Monitor your progress through every stage of the hiring pipeline in real-time.",
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    title: "Verified companies",
    desc: "Apply with confidence. We manually vet every employer to ensure high-quality listings.",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#170e2c] relative overflow-hidden">
     
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3e3875] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[#7270b1] font-semibold tracking-widest uppercase text-sm mb-4">
            The Jobify Advantage
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything you need to <span className="text-[#5f5aa7]">land your next role.</span>
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl border border-white/5 bg-[#3e3875]/20 backdrop-blur-sm transition-all duration-500 hover:bg-[#3e3875]/40 hover:border-[#5f5aa7]/50 hover:-translate-y-2"
            >
             
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#5f5aa7]/10 text-[#5f5aa7] mb-6 group-hover:scale-110 group-hover:bg-[#5f5aa7] group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>

              <h4 className="text-xl font-bold text-white mb-3 tracking-wide">
                {f.title}
              </h4>
              <p className="text-[#7270b1] leading-relaxed text-sm group-hover:text-gray-200 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}