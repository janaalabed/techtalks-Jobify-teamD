
import Navbar from "@/components/landingPageComponents/NavBar";
import Hero from "@/components/landingPageComponents/Hero";
import PlatformOverview from "@/components/landingPageComponents/PlatformOverview";
import HowItWorks from "@/components/landingPageComponents/HowItWorks";
import Features from "@/components/landingPageComponents/Features";
import Testimonials from "@/components/landingPageComponents/Testimonials";
import Contact from "@/components/landingPageComponents/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PlatformOverview />
      <section id="features">
        <Features />
      </section>
      <section id="how-it works" className="scroll-mt-24">
        <HowItWorks />
      </section>

      <Testimonials />
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}

