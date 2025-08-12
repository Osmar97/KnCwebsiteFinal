import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: Event) => {
      const wheelEvent = e as unknown as WheelEvent;
      if (mediaFullyExpanded && wheelEvent.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = wheelEvent.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as unknown as TouchEvent;
      setTouchStartY(touchEvent.touches[0].clientY);
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as unknown as TouchEvent;
      if (!touchStartY) return;

      const touchY = touchEvent.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden bg-black"
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <div
            className="absolute inset-0 z-0 h-full transition-opacity duration-100"
            style={{ opacity: 1 - scrollProgress }}
          >
            <img
              src={bgImageSrc}
              alt="Background"
              className="w-screen h-screen object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-95" />
          </div>

          {/* Floating Geometric Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 border border-gold/20 rotate-45 animate-float"></div>
            <div 
              className="absolute bottom-20 right-10 w-24 h-24 border border-gold/30 rotate-12 animate-float" 
              style={{ animationDelay: '2s' }}
            ></div>
            <div 
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold/10 rotate-45 animate-float" 
              style={{ animationDelay: '4s' }}
            ></div>
            <div 
              className="absolute top-1/3 right-1/3 w-20 h-20 border border-gold/15 rounded-full animate-float" 
              style={{ animationDelay: '1s' }}
            ></div>
          </div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 10px rgba(160, 142, 42, 0.35)',
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={mediaSrc}
                    alt={title || 'Hero image'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div
                    className="absolute inset-0 bg-black/50 rounded-xl transition-opacity duration-200"
                    style={{ opacity: 0.7 - scrollProgress * 0.3 }}
                  />
                </div>

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {subtitle && (
                    <p
                      className="text-2xl text-gold"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {subtitle}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-gold font-medium text-center"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center z-20">
                <img 
                  src="/lovable-uploads/1_Simbolo_Dourado.png" 
                  alt="Logo" 
                  className="w-32 h-32 object-contain drop-shadow-[0_0_10px_rgba(160,143,42,0.8)]" 
                />
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
                      
                      <p className="text-gray-300 text-lg md:text-xl mb-3 max-w-3xl mx-auto leading-relaxed font-bold">
                        Connecting Visionary Investors to Remarkable Properties
                      </p>
                      
                      <p className="text-white text-xl mb-12 max-w-3xl mx-auto leading-relaxed md:text-base font-extralight py-[2px]">
                        Welcome to Kings 'n Company
                      </p>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <div
                  className="text-4xl md:text-5xl lg:text-6xl font-light text-gold transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </div>
                <div
                  className="text-4xl md:text-5xl lg:text-6xl font-light text-center text-white transition-none"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </div>
              </div>
            </div>

            <section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20 transition-opacity duration-700 bg-black"
              style={{ opacity: showContent ? 1 : 0 }}
            >
              {children}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;