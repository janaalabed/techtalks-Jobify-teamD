"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#849cfb] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20 lg:py-28">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12 lg:gap-14">
          
          {/* Text */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left w-full">
            <span className="inline-block bg-blue-100 text-[#2529a1] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
              For students & employers
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              The easiest way to land{" "}
              <span className="text-[#2529a1]">jobs & internships</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0">
              Jobify connects talent and companies through a fast, modern, and transparent hiring platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
              
              <a  href="../register/"
                className="bg-[#2529a1] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow hover:shadow-lg transition-all text-sm sm:text-base"
              >
                Get Started
              </a>
              
               <a href="#how-it-works"
                className="border border-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all text-sm sm:text-base"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full max-w-md sm:max-w-lg lg:max-w-none relative aspect-square sm:aspect-auto sm:min-h-[400px] lg:min-h-[500px]">
            <Image
              src={"/uploads/hero-illustration.png"}
              alt="Jobify Illustration"
              priority
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}