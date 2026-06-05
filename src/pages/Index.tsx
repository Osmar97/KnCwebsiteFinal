
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { SectionsCarousel } from "@/components/SectionsCarousel";
import { Testimonials } from "@/components/Testimonials";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { GlobalCTA } from "@/components/GlobalCTA";
import { Footer } from "@/components/Footer";
import { B2BScalingHero } from "@/components/B2BScalingHero";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Index = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <Navigation />
      <Hero />
      
      {/* B2B Scaling Hero Section */}
      <B2BScalingHero />
      
      {/* Sections Carousel */}
      <div className="bg-black">
        <SectionsCarousel />
      </div>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      <GlobalCTA />
      
      {/* Generational Wealth Hero */}
      <GenerationalWealthHero />
      
      <Footer />
    </div>
  );
};

export default Index;
