
import { Star, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "./types";

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  currentTestimonial: number;
  isVisible: boolean;
  onSelectTestimonial: (index: number) => void;
}

export const TestimonialsGrid = ({ 
  testimonials, 
  currentTestimonial, 
  isVisible, 
  onSelectTestimonial 
}: TestimonialsGridProps) => {
  return (
    <div className={`mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <Card 
            key={testimonial.id}
            className={`bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700/30 hover:border-gray-600/50 transition-all duration-500 cursor-pointer group ${
              index === currentTestimonial ? 'ring-2 ring-gray-600/50' : ''
            }`}
            onClick={() => onSelectTestimonial(index)}
          >
            <CardContent className="p-6 bg-stone-600">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-600/50" 
                />
                <div className="ml-3">
                  <h4 className="text-white text-sm font-medium">{testimonial.name}</h4>
                  <p className="text-gold text-xs">{testimonial.role}</p>
                </div>
                {testimonial.videoTestimonial && (
                  <Play className="w-4 h-4 text-gold ml-auto" />
                )}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                "{testimonial.text.substring(0, 120)}..."
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gold fill-current" />
                  ))}
                </div>
                <span className="text-gold text-xs">{testimonial.highlight}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
