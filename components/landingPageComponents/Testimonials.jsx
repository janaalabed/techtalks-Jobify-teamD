"use client";

export default function Testimonials() {
  const testimonials = [
    { quote: "Jobify made applying effortless.", name: "Sarah J.", role: "Student" },
    { quote: "We hired interns in days, not weeks.", name: "Marc K.", role: "HR at TechCo" },
    { quote: "The cleanest UI I've used this year.", name: "Alex R.", role: "Recruiter" },
  ];

  return (
    <section className="py-24 bg-[#170e2c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-16"><span className="text-[#5f5aa7]">Loved</span> by the community</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#3e3875]/10 border border-white/5 p-8 rounded-2xl">
              <p className="text-gray-300 mb-6 text-lg italic font-light">"{t.quote}"</p>
              <div>
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-[#7270b1] text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}