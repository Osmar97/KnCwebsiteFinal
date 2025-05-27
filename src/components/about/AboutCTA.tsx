
import { Button } from "@/components/ui/button";

interface AboutCTAProps {
  isVisible: boolean;
}

export const AboutCTA = ({ isVisible }: AboutCTAProps) => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1000ms' }}>
      <Button 
        className="bg-gold hover:bg-gold-light text-black font-medium tracking-wider px-8 py-3 transition-all duration-300 transform hover:scale-105"
        onClick={scrollToContact}
      >
        BEGIN YOUR JOURNEY
      </Button>
    </div>
  );
};
