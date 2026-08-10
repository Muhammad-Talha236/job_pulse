// src/pages/HomePage.jsx

import CTASection from "../components/landing/CTASection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";

function HomePage() {
  return (
    <>
      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <CTASection />
    </>
  );
}

export default HomePage;