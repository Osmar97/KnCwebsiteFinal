
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Markets } from "@/components/Markets";
import { Network } from "@/components/Network";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      
      {/* Company Introduction Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <img 
              src="/lovable-uploads/8c617100-8773-41ff-8d61-686d5584ec89.png" 
              alt="Kings 'n Company Logo" 
              className="mx-auto mb-8 max-w-md w-full h-auto"
            />
          </div>
          
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed italic">
            A real estate investment consultancy firm that seamlessly blends the strengths of regional market expertise 
            with an expansive network of international investors and partners.
          </p>
        </div>
      </section>
      
      <Services />
      <About />
      <Markets />
      <Network />
      <Team />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
