"use client";
import { FaUserCheck, FaPaperPlane, FaClipboardList, FaBuilding } from "react-icons/fa";

export default function Features() {
  const features = [
    { icon: FaUserCheck, title: "Easy profile setup", desc: "Create your profile in minutes." },
    { icon: FaPaperPlane, title: "One-click apply", desc: "Apply instantly to opportunities." },
    { icon: FaClipboardList, title: "Track applications", desc: "Everything in one dashboard." },
    { icon: FaBuilding, title: "Verified companies", desc: "Trusted job postings only." },
  ];

  return (
    <section id="features" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-14 text-[#2529a1]">
          Why Jobify?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="
                  bg-white 
                  hover:bg-blue-100 
                  p-8 
                  rounded-2xl 
                  shadow 
                  hover:shadow-xl 
                  transition-all 
                  duration-300 
                  transform 
                  hover:-translate-y-1
                "
              >
                <Icon className="w-10 h-10 text-[#2529a1] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
