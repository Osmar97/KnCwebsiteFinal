
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { SectionsCarousel } from "@/components/SectionsCarousel";
import { Testimonials } from "@/components/Testimonials";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <Navigation />
      <Hero />
      
      
      {/* Sections Carousel */}
      <div className="bg-black">
        <SectionsCarousel />
      </div>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Generational Wealth Hero */}
      <GenerationalWealthHero />
      
      <Footer />
    </div>
  );
};

export default Index;
