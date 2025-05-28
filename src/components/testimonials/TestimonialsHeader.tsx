
import { Quote } from "lucide-react";

interface TestimonialsHeaderProps {
  isVisible: boolean;
}

export const TestimonialsHeader = ({ isVisible }: TestimonialsHeaderProps) => {
  return (
    <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="inline-flex items-center gap-2 mb-6">
        <Quote className="w-6 h-6 text-gold animate-pulse" />
        <span className="text-gold text-sm tracking-widest font-light">SUCCESS STORIES</span>
        <Quote className="w-6 h-6 text-gold animate-pulse transform rotate-180" />
      </div>
      
      <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
        VOICES OF <span className="text-gold">SUCCESS</span>
      </h2>
      
      <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
      
      <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
        Real stories from clients who transformed their property ownership journey with Kings 'n Company
      </p>
    </div>
  );
};
