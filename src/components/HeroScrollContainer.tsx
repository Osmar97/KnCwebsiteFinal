import { useEffect, useRef, useState } from 'react';

interface HeroScrollConfig {
  backgroundImage: string;
  textBlend: boolean;
  duration?: number;
}

export const HeroScrollContainer = ({
  backgroundImage,
  textBlend = false,
  duration = 900,
}: HeroScrollConfig) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Handle scroll with debouncing for performance
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) {
        return;
      }
      
      isScrollingRef.current = true;
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Calculate scroll position within the hero viewport
  useEffect(() => {
    const calculateScrollProgress = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const heroHeight = rect.height;

      // Allow up to 40% of hero height to be scrolled (peeking effect)
      const maxScroll = heroHeight * 0.4;
      const effectiveViewport = Math.min(viewportHeight, heroHeight);

      // Calculate how much we've scrolled past the hero start
      const scrollFromTop = Math.max(0, window.scrollY - rect.top);

      // Clamp between 0 and maxScroll for smooth progression
      const normalizedProgress = Math.min(scrollFromTop / maxScroll, 1);
      setScrollProgress(normalizedProgress);
    };

    const throttledCalculateScroll = () => {
      if (!scrollTimeoutRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          calculateScrollProgress();
          scrollTimeoutRef.current = undefined;
        }, 16); // ~60fps throttling
      }
    };

    window.addEventListener('scroll', throttledCalculateScroll, { passive: true });

    // Initial calculation
    calculateScrollProgress();

    return () => {
      window.removeEventListener('scroll', throttledCalculateScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    isScrolling,
    scrollProgress,
    containerRef,
  };
};

export default HeroScrollContainer;
