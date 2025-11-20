import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FloorPlanViewerProps {
  imageUrls: string[];
  title?: string;
}

const FloorPlanViewer = ({ imageUrls, title }: FloorPlanViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">No floor plans available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      {imageUrls.length > 1 && (
        <div className="flex items-center justify-center gap-4 p-4 border-b">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {imageUrls.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Display */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/50">
        <img
          src={imageUrls[currentIndex]}
          alt={title ? `${title} - Planta ${currentIndex + 1}` : `Planta ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default FloorPlanViewer;
