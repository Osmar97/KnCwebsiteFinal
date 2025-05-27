
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProcessSection from '@/components/ProcessSection';
import WealthSection from '@/components/WealthSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProcessSection />
      <WealthSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
