
import { Star, Play } from "lucide-react";
import { Testimonial } from "./types";

interface TestimonialClientInfoProps {
  testimonial: Testimonial;
}

export const TestimonialClientInfo = ({ testimonial }: TestimonialClientInfoProps) => {
  return (
    <div className="lg:col-span-2 p-8 lg:p-12 bg-gradient-to-br from-gold/10 to-gold/5 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-full h-full rounded-full object-cover border-4 border-gray-600/50 shadow-2xl" 
          />
          {testimonial.videoTestimonial && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gold/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-gold transition-colors">
                <Play className="w-5 h-5 text-black ml-0.5" />
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-medium text-white mb-2">{testimonial.name}</h3>
          <p className="text-gold text-sm mb-1">{testimonial.role}</p>
          <p className="text-gray-400 text-xs mb-4">{testimonial.location}</p>
          
          <div className="flex justify-center mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-gold fill-current" />
            ))}
          </div>
          
          <div className="inline-flex items-center px-4 py-2 bg-gold/20 rounded-full border border-gray-600/50">
            <span className="text-gold text-xs font-medium">{testimonial.highlight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
