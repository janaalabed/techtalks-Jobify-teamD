"use client";

import { FaQuoteLeft, FaUserCircle } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Jobify made applying so simple!",
      name: "Alice, Student",
    },
    {
      quote: "We found our interns quickly through Jobify!",
      name: "Tech Corp HR",
    },
    {
      quote: "Jobify streamlined our hiring process!",
      name: "Mark, Recruiter",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          What People Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition"
            >
              <FaQuoteLeft className="text-gray-400 w-6 h-6" />
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3 mt-2">
                <FaUserCircle className="w-8 h-8 text-gray-500" />
                <span className="text-gray-900 font-medium">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
