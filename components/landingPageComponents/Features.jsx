"use client"; // optional if using hooks later

import { FaUserCheck, FaPaperPlane, FaClipboardList, FaBuilding } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaUserCheck className="w-8 h-8 text-blue-500" />,
      title: "Easy profile setup",
      description: "Create your professional profile quickly and efficiently.",
    },
    {
      icon: <FaPaperPlane className="w-8 h-8 text-green-500" />,
      title: "One-click applications",
      description: "Apply to jobs and internships instantly with one click.",
    },
    {
      icon: <FaClipboardList className="w-8 h-8 text-purple-500" />,
      title: "Application tracking dashboard",
      description: "Track all your applications in a single dashboard.",
    },
    {
      icon: <FaBuilding className="w-8 h-8 text-yellow-500" />,
      title: "Verified company profiles",
      description: "Connect with trusted companies and verified job postings.",
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Key Features
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-4 hover:scale-105 transition"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-700 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
