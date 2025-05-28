import { Button } from "@/components/ui/button";
interface AboutCTAProps {
  isVisible: boolean;
}
export const AboutCTA = ({
  isVisible
}: AboutCTAProps) => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
    transitionDelay: '1000ms'
  }}>
      
    </div>;
};