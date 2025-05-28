
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
      
      {/* Company Introduction Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Image */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png" 
                alt="Company Image 1" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
            
            {/* Center Content */}
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/bf8148de-409a-4bd5-88c1-11dca2d5bdab.png" 
                  alt="Kings 'n Company Logo" 
                  className="mx-auto max-w-md w-full h-auto"
                />
              </div>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed italic">
                A real estate investment consultancy firm that seamlessly blends the strengths of regional market expertise 
                with an expansive network of international investors and partners.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/8c617100-8773-41ff-8d61-686d5584ec89.png" 
                alt="Company Image 2" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
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
