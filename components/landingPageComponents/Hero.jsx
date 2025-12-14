
"use client";
import Image from "next/image";
import heroIllustration from "@/public/uploads/hero-illustration.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#849cfb] to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 flex flex-col-reverse md:flex-row items-center gap-14">

        {/* Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <span className="inline-block bg-blue-100 text-[#2529a1] px-4 py-1 rounded-full text-sm font-medium">
            For students & employers
           </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            The easiest way to land{" "}
            <span className="text-[#2529a1]">jobs & internships</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl mx-auto md:mx-0">
            Jobify connects talent and companies through a fast, modern, and transparent hiring platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
               href="../register/"
               className="bg-[#2529a1] text-white px-8 py-4 rounded-xl font-semibold shadow hover:shadow-lg transition"
             >
              Get Started
            </a>
            <a
              href="#how-it works"
              className="border border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 w-full">
          <Image
            src={heroIllustration}
            alt="Jobify Illustration"
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
