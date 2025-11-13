import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
}

export const PropertyImageCarousel = ({ images, title }: PropertyImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  if (images.length === 0) return null;

  return (
    <div 
      {...swipeHandlers}
      className="relative w-full mb-8 group"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Image */}
      <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-gold hover:text-gold-light border border-gold/20 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 h-12 w-12"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-gold hover:text-gold-light border border-gold/20 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 h-12 w-12"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-gold text-sm border border-gold/20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "w-8 bg-gold" 
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
