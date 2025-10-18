import { useState, useEffect } from "react";
import { TestimonialsHeader } from "./testimonials/TestimonialsHeader";
import { TestimonialContent } from "./testimonials/TestimonialContent";
import { TestimonialNavigation } from "./testimonials/TestimonialNavigation";
import { testimonials } from "./testimonials/data";

export const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePrevious = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handleGoTo = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsHeader isVisible={isVisible} />
        
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 shadow-xl">
          <TestimonialContent testimonial={testimonials[currentTestimonial]} />
          
          <TestimonialNavigation
            currentTestimonial={currentTestimonial}
            totalTestimonials={testimonials.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onGoTo={handleGoTo}
          />
        </div>
      </div>
    </section>
  );
};
