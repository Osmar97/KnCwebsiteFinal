
import { Quote } from "lucide-react";
import { Testimonial } from "./types";

interface TestimonialContentProps {
  testimonial: Testimonial;
}

export const TestimonialContent = ({ testimonial }: TestimonialContentProps) => {
  return (
    <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
      <div className="relative">
        <Quote className="w-12 h-12 text-gold/30 mb-6" />
        
        <blockquote className="text-white text-lg lg:text-xl font-light leading-relaxed mb-8">
          "{testimonial.text}"
        </blockquote>
        
        <Quote className="w-12 h-12 text-gold/30 ml-auto transform rotate-180" />
      </div>
    </div>
  );
};
