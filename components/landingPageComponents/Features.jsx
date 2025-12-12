"use client";

import { FaUserCheck, FaPaperPlane, FaClipboardList, FaBuilding } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: FaUserCheck,
      iconColor: "blue-500",
      bgHover: "blue-300",
      title: "Easy profile setup",
      description: "Create your professional profile quickly and efficiently.",
    },
    {
      icon: FaPaperPlane,
      iconColor: "green-500",
      bgHover: "green-300",
      title: "One-click applications",
      description: "Apply to jobs and internships instantly with one click.",
    },
    {
      icon: FaClipboardList,
      iconColor: "purple-500",
      bgHover: "purple-300",
      title: "Application tracking dashboard",
      description: "Track all your applications in a single dashboard.",
    },
    {
      icon: FaBuilding,
      iconColor: "yellow-500",
      bgHover: "yellow-300",
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
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`
                  group bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-4 
                  transition-all duration-300 transform hover:scale-105
                  hover:bg-${feature.bgHover}
                `}
              >
                <Icon
                  className={`
                    w-8 h-8 text-${feature.iconColor}
                    transition-colors duration-300 group-hover:text-white
                  `}
                />
                <h3
                  className={`
                    text-xl font-semibold text-gray-900 
                    transition-colors duration-300 group-hover:text-white
                  `}
                >
                  {feature.title}
                </h3>
                <p
                  className={`
                    text-gray-700 text-center 
                    transition-colors duration-300 group-hover:text-white
                  `}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
