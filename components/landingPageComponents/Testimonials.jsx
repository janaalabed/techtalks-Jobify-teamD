
"use client";
import { FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    { quote: "Jobify made applying effortless.", name: "Student" },
    { quote: "We hired interns in days.", name: "HR Manager" },
    { quote: "Clean and efficient platform.", name: "Recruiter" },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center" >
        <h2 className="text-4xl font-bold mb-14 text-[#2529a1]">Trusted by Users</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <FaQuoteLeft className="text-[#2529a1] mb-4 mx-auto" />
              <p className="italic text-gray-700 mb-4">"{t.quote}"</p>
              <span className="font-semibold text-gray-900">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
