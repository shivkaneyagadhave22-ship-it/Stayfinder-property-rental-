import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";

import Hero from "../components/Hero";
import PropertyCategories from "../components/PropertyCategories";
import FeaturedProperties from "../components/FeaturedProperties";

function Home() {
  return (
    <>
      <Hero />

      <PropertyCategories />

      <FeaturedProperties />

      <WhyChooseUs />

      <HowItWorks />

      <CTASection />

      <Footer />
    </>
  );
}

export default Home;