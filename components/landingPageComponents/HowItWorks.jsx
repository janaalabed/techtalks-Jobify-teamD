"use client";
import { CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const applicantSteps = ["Create profile", "Upload CV once", "One-click apply", "Track status"];
  const employerSteps = ["Company profile", "Post job offers", "Review talent", "Hire faster"];

  return (
    <section id="how-it-works" className="py-24 bg-[#170e2c]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#7270b1] font-bold tracking-widest uppercase text-sm mb-3">Workflow</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            How <span className="text-[#5f5aa7]">Jobify</span> works
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "For Applicants", steps: applicantSteps, color: "#5f5aa7", icon: "🎓" },
            { title: "For Employers", steps: employerSteps, color: "#7270b1", icon: "🏢" }
          ].map((card, idx) => (
            <div key={idx} className="bg-[#3e3875]/10 border border-white/5 rounded-3xl p-8 md:p-12 transition-all hover:border-white/20">
              <div className="text-4xl mb-6">{card.icon}</div>
              <h4 className="text-2xl font-bold text-white mb-8">{card.title}</h4>
              <ul className="space-y-6 mb-10">
                {card.steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                      0{i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <button style={{ backgroundColor: card.color }} className="w-full py-4 rounded-xl text-white font-bold hover:opacity-90 transition shadow-lg">
                Join as {card.title.split(' ')[1]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}