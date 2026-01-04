import Hero from '../components/landingPageComponents/Hero.jsx'
import Footer from "../components/landingPageComponents/Footer";
import HowItWorks from '../components/landingPageComponents/HowItWorks.jsx'
import PlatformOverview from "../components/landingPageComponents/PlatformOverview.jsx";
import Features from "../components/landingPageComponents/Features.jsx";
import Testimonials from "../components/landingPageComponents/Testimonials.jsx";
import React from 'react'

const page = () => {
  return (
   <>
   <Hero/>
   <PlatformOverview/> 
    <Features/>
    <HowItWorks/>
    <Testimonials/>
   <Footer/>
   </>
  )
}

export default page