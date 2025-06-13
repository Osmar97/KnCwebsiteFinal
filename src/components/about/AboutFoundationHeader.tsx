
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutFoundationHeaderProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundationHeader = ({
  isVisible,
  scrolled
}: AboutFoundationHeaderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    {
      src: "/lovable-uploads/20d3ac97-5a99-4fae-a42e-4133cbfd7772.png",
      caption: "Building strategic partnerships across international markets"
    },
    {
      src: "/lovable-uploads/dbd36462-e957-4acd-9a25-7c59826d89b8.png",
      caption: "Focused on meaningful connections and long-term success"
    },
    {
      src: "/lovable-uploads/a7abb88c-a2ac-48f9-b659-fa1ea574690c.png",
      caption: "Focused on meaningful connections and long-term success"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
          OUR <span className="text-gold">STATEMENT</span>
        </h2>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
        <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
          Our foundation is built on trust, excellence, and a commitment to creating lasting value in every partnership.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative mb-16">
        <div className="relative h-80 overflow-hidden rounded-lg">
          {images.map((image, index) => {
            const isActive = index === currentSlide;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <img 
                  src={image.src} 
                  alt={image.caption}
                  className="w-full h-80 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-light">{image.caption}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white border-gold/30 hover:border-gold/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white border-gold/30 hover:border-gold/50"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-gold' : 'bg-gray-500/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
