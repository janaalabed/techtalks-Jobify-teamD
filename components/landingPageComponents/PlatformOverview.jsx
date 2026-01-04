"use client";

import React from "react";
import { Zap, Shield, Users } from "lucide-react";

const overviewItems = [
  {
    title: "Simple",
    desc: "A streamlined interface designed for maximum efficiency and zero learning curve.",
    icon: <Zap className="w-6 h-6" />,
    border: "border-[#5f5aa7]/30",
  },
  {
    title: "Fast",
    desc: "From profile creation to job application in under 60 seconds. Speed is our priority.",
    icon: <Shield className="w-6 h-6" />,
    border: "border-[#7270b1]/30",
  },
  {
    title: "Unified Ecosystem",
    desc: "A bridge connecting ambitious students directly with forward-thinking companies.",
    icon: <Users className="w-6 h-6" />,
    border: "border-[#3e3875]/30",
  },
];

export default function PlatformOverview() {
  return (
    <section className="py-24 bg-[#170e2c] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#3e3875_0%,transparent_70%)] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-[#7270b1] font-semibold tracking-[0.2em] uppercase text-xs">Our Mission</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            What is <span className="text-[#5f5aa7]">Jobify?</span>
          </h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A complete hiring ecosystem where students apply smarter and companies hire faster.
          </p>
        </div>

        {/* Improved: Grid now handles tablets (2 cols) and desktops (3 cols) better */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {overviewItems.map((item, i) => (
            <div
              key={i}
              className={`group p-8 md:p-10 rounded-3xl bg-[#3e3875]/10 border ${item.border} backdrop-blur-sm transition-all duration-500 hover:bg-[#3e3875]/20 hover:-translate-y-2`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#170e2c] border border-white/10 flex items-center justify-center text-[#5f5aa7] mb-6 group-hover:scale-110 group-hover:text-white group-hover:bg-[#5f5aa7] transition-all duration-300">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}