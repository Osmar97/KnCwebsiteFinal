
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { SectionsCarousel } from "@/components/SectionsCarousel";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <Navigation />
      <Hero />
      
      {/* Sections Carousel */}
      <SectionsCarousel />
      
      {/* Company Introduction Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/bf8148de-409a-4bd5-88c1-11dca2d5bdab.png" 
              alt="Kings 'n Company Logo" 
              className="mx-auto max-w-md w-full h-auto"
            />
          </div>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed italic">
            A real estate investment consultancy firm that seamlessly blends the strengths of regional market expertise 
            with an expansive network of international investors and partners.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
