
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal = ({ images, initialIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[90vh] bg-black border-none p-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <ScrollArea className="w-full h-full">
          <div className="relative w-full min-h-full flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full h-auto object-contain"
              style={{ maxHeight: 'calc(90vh - 2rem)' }}
            />

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
