import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

interface FloorPlanViewerProps {
  imageUrls: string[];
  title?: string;
}

const FloorPlanViewer = ({ imageUrls, title }: FloorPlanViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(0);
  const [hasManuallyZoomed, setHasManuallyZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate fit-to-screen scale
  const calculateFitScale = () => {
    if (!imageRef.current || !containerRef.current) return 1;
    
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current;
    
    // Get natural image dimensions
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    
    if (!imageWidth || !imageHeight) return 1;
    
    // Calculate scale to fit container (with some padding)
    const padding = 40; // 20px padding on each side
    const availableWidth = container.width - padding;
    const availableHeight = container.height - padding;
    
    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;
    
    // Use the smaller scale to ensure entire image fits
    const calculatedScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 100%
    
    return calculatedScale;
  };

  // Apply fit-to-screen when image loads
  const handleImageLoad = () => {
    const newFitScale = calculateFitScale();
    setFitScale(newFitScale);
    setScale(newFitScale * 0.5); // Start at 50% of fit scale for floor plans
    setPosition({ x: 0, y: 0 });
    setHasManuallyZoomed(false);
  };

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(fitScale);
    setPosition({ x: 0, y: 0 });
    setHasManuallyZoomed(false);
  }, [currentIndex, fitScale]);

  // Recalculate fit scale on window resize (only if user hasn't manually zoomed)
  useEffect(() => {
    const handleResize = () => {
      if (!hasManuallyZoomed) {
        const newFitScale = calculateFitScale();
        setFitScale(newFitScale);
        setScale(newFitScale);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasManuallyZoomed]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
    setHasManuallyZoomed(true);
  };

  const handleZoomOut = () => {
    const minScale = Math.min(fitScale * 0.5, 0.3); // Allow zoom out to half of fit scale or 30%, whichever is smaller
    const newScale = Math.max(scale - 0.5, minScale);
    setScale(newScale);
    if (newScale <= fitScale + 0.1) {
      setPosition({ x: 0, y: 0 });
    }
    setHasManuallyZoomed(true);
  };

  const handleResetZoom = () => {
    setScale(fitScale);
    setPosition({ x: 0, y: 0 });
    setHasManuallyZoomed(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const minScale = Math.min(fitScale * 0.5, 0.3); // Allow zoom out to half of fit scale or 30%
    const newScale = Math.min(Math.max(scale + delta, minScale), 5);
    
    if (newScale > fitScale) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xs = (x - position.x) / scale;
        const ys = (y - position.y) / scale;
        setPosition({
          x: x - xs * newScale,
          y: y - ys * newScale,
        });
      }
      setScale(newScale);
    } else {
      setScale(newScale);
      if (Math.abs(newScale - fitScale) < 0.01) {
        setPosition({ x: 0, y: 0 });
      }
    }
    setHasManuallyZoomed(true);
  };

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > fitScale) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > fitScale) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pinch to zoom
  const getTouchDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && scale > fitScale) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      if (touchDistance > 0) {
        const delta = (newDistance - touchDistance) * 0.01;
        const minScale = Math.min(fitScale * 0.5, 0.3); // Allow zoom out to half of fit scale or 30%
        const newScale = Math.min(Math.max(scale + delta, minScale), 5);
        
        if (newScale > fitScale) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const x = centerX - rect.left;
            const y = centerY - rect.top;
            const xs = (x - position.x) / scale;
            const ys = (y - position.y) / scale;
            setPosition({
              x: x - xs * newScale,
              y: y - ys * newScale,
            });
          }
          setScale(newScale);
        } else {
          setScale(newScale);
          if (Math.abs(newScale - fitScale) < 0.01) {
            setPosition({ x: 0, y: 0 });
          }
        }
        setHasManuallyZoomed(true);
      }
      setTouchDistance(newDistance);
    } else if (e.touches.length === 1 && isDragging && scale > fitScale) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
  };

  // Swipe for navigation (only when not zoomed)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => Math.abs(scale - fitScale) < 0.01 && imageUrls.length > 1 && handleNext(),
    onSwipedRight: () => Math.abs(scale - fitScale) < 0.01 && imageUrls.length > 1 && handlePrevious(),
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">No floor plans available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 p-3 sm:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= Math.min(fitScale * 0.5, 0.3)}
            className="h-9 w-9 sm:h-10 sm:w-10"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs sm:text-sm text-muted-foreground min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 5}
            className="h-9 w-9 sm:h-10 sm:w-10"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetZoom}
            disabled={Math.abs(scale - fitScale) < 0.01}
            className="h-9 w-9 sm:h-10 sm:w-10"
            title="Reset Zoom"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Navigation */}
        {imageUrls.length > 1 && (
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground min-w-[60px] text-center">
              {currentIndex + 1} / {imageUrls.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Image Display */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 touch-none select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...(Math.abs(scale - fitScale) < 0.01 ? swipeHandlers : {})}
        style={{ cursor: scale > fitScale ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          ref={imageRef}
          src={imageUrls[currentIndex]}
          alt={title ? `${title} - Planta ${currentIndex + 1}` : `Planta ${currentIndex + 1}`}
          onLoad={handleImageLoad}
          className="max-w-full max-h-full object-contain pointer-events-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Mobile Hint */}
      {Math.abs(scale - fitScale) < 0.01 && (
        <div className="p-2 text-center text-xs text-muted-foreground bg-background/95 backdrop-blur border-t sm:hidden">
          Pinch to zoom • Swipe to navigate
        </div>
      )}
    </div>
  );
};

export default FloorPlanViewer;
