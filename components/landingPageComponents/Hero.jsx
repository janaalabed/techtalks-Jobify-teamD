"use client"; // optional if using hooks later

import Image from "next/image";
import heroIllustration from "@/assets/hero-illustration.png"; 

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left Side: Headline + Description + CTA */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Your bridge to internships and job opportunities.
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Jobify connects students, job seekers, and companies in a simple, modern hiring platform.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#signup"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Sign Up
            </a>
            <a
              href="#how-it-works"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src={heroIllustration}
            alt="Students and Employers Illustration"
            width={500}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
