
export default function PlatformOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-4xl font-bold text-[#2529a1]">What is Jobify?</h2>

        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          A complete hiring ecosystem where students apply smarter and companies hire faster.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {["Simple", "Fast", "Built for students & companies"].map((item) => (
            <div
              key={item}
              className="p-8 bg-blue-100 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
