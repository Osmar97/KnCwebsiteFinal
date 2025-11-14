import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface FullscreenGalleryProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const FullscreenGallery = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: FullscreenGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [swipeDownStart, setSwipeDownStart] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const goToNext = () => {
    if (scale === 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (scale === 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (scale === 1) {
        setScale(2.5);
        // Center zoom on tap point
        const rect = imageRef.current?.getBoundingClientRect();
        if (rect) {
          const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
          const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
          const percentX = x / rect.width;
          const percentY = y / rect.height;
          setPosition({
            x: -(percentX - 0.5) * rect.width * 1.5,
            y: -(percentY - 0.5) * rect.height * 1.5,
          });
        }
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
    setLastTap(now);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      (imageRef.current as any)._pinchDistance = distance;
    } else if (e.touches.length === 1 && scale === 1) {
      // Track vertical swipe for close gesture
      setSwipeDownStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const prevDistance = (imageRef.current as any)._pinchDistance;
      if (prevDistance) {
        const scaleChange = distance / prevDistance;
        const newScale = Math.min(Math.max(1, scale * scaleChange), 4);
        setScale(newScale);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }
      (imageRef.current as any)._pinchDistance = distance;
    } else if (scale > 1 && e.touches.length === 1) {
      // Pan when zoomed
      if (isDragging) {
        const deltaX = e.touches[0].clientX - dragStart.x;
        const deltaY = e.touches[0].clientY - dragStart.y;
        setPosition({
          x: position.x + deltaX,
          y: position.y + deltaY,
        });
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    } else if (scale === 1 && e.touches.length === 1 && swipeDownStart !== null) {
      // Check for swipe down to close
      const deltaY = e.touches[0].clientY - swipeDownStart;
      if (deltaY > 100) {
        // Swipe down detected
        onClose();
        setSwipeDownStart(null);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setSwipeDownStart(null);
    if (imageRef.current) {
      delete (imageRef.current as any)._pinchDistance;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (scale === 1) goToNext();
    },
    onSwipedRight: () => {
      if (scale === 1) goToPrevious();
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, scale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex-1">
            <h2 className="text-sm sm:text-base font-medium truncate">{title}</h2>
            <p className="text-xs text-gray-300 mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-full bg-gold/20 hover:bg-gold/30 text-gold transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        {...swipeHandlers}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={imageRef}
          className="relative w-full h-full flex items-center justify-center touch-none"
          onClick={handleDoubleTap}
          onTouchEnd={handleDoubleTap}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      {/* Navigation Arrows - Desktop */}
      {scale === 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex gap-4">
            <span className="text-gold font-medium">{images.length} photos</span>
          </div>
          {scale === 1 ? (
            <button
              onClick={() => setScale(2)}
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Enlarge</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-gold hover:text-gold-light transition-colors"
            >
              Reset zoom
            </button>
          )}
        </div>
      </div>

      {/* Mobile Hint */}
      {scale === 1 && (
        <div className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center pointer-events-none">
          Swipe down to close • Double tap to zoom
        </div>
      )}
    </div>
  );
};
