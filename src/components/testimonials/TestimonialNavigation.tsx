
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialNavigationProps {
  currentTestimonial: number;
  totalTestimonials: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export const TestimonialNavigation = ({ 
  currentTestimonial, 
  totalTestimonials, 
  onPrevious, 
  onNext, 
  onGoTo 
}: TestimonialNavigationProps) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <button 
        onClick={onPrevious}
        className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 text-gold" />
      </button>

      <div className="flex space-x-3">
        {Array.from({ length: totalTestimonials }).map((_, index) => (
          <button
            key={index}
            onClick={() => onGoTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentTestimonial 
                ? 'bg-gold scale-125' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      <button 
        onClick={onNext}
        className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 text-gold" />
      </button>
    </div>
  );
};
