
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "./testimonials/data";
import { TestimonialsHeader } from "./testimonials/TestimonialsHeader";
import { TestimonialClientInfo } from "./testimonials/TestimonialClientInfo";
import { TestimonialContent } from "./testimonials/TestimonialContent";
import { TestimonialNavigation } from "./testimonials/TestimonialNavigation";
import { TestimonialsGrid } from "./testimonials/TestimonialsGrid";

export const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(index);
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <TestimonialsHeader isVisible={isVisible} />

        {/* Main Testimonial Display */}
        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                <TestimonialClientInfo testimonial={testimonials[currentTestimonial]} />
                <TestimonialContent testimonial={testimonials[currentTestimonial]} />
              </div>
            </CardContent>
          </Card>

          <TestimonialNavigation
            currentTestimonial={currentTestimonial}
            totalTestimonials={testimonials.length}
            onPrevious={prevTestimonial}
            onNext={nextTestimonial}
            onGoTo={goToTestimonial}
          />
        </div>

        {/* Hide testimonials grid on mobile for better performance */}
        <div className="hidden sm:block">
          <TestimonialsGrid
            testimonials={testimonials}
            currentTestimonial={currentTestimonial}
            isVisible={isVisible}
            onSelectTestimonial={goToTestimonial}
          />
        </div>
      </div>
    </section>
  );
};
