export default function PlatformOverview() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto text-center space-y-6 px-6">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What Is Jobify?
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-lg md:text-xl">
          Jobify is a platform where job seekers can create profiles, upload CVs, and apply to opportunities—
          while companies can post jobs and manage applicants easily.
        </p>

        {/* Optional Sub-text / Features */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6 text-gray-700 font-medium">
          <span className="bg-gray-100 px-4 py-2 rounded-lg">Simple</span>
          <span className="bg-gray-100 px-4 py-2 rounded-lg">Fast</span>
          <span className="bg-gray-100 px-4 py-2 rounded-lg">Designed for students & companies</span>
        </div>
      </div>
    </section>
  );
}